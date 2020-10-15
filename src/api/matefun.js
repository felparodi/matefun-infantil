//Aca la idea es tener los methodos mas propios de matefun
import * as services from '../server_connection/services';
import * as webSocket from '../server_connection/webSocket';
import * as snapHelper from '../classes/helpers/snapshot';
import Compiler from '../classes/compiler';
import { CustomFuncPipe } from '../classes/pipes/customFuncPipe'
import * as board from './board';
import { WORKSPACE_FILE_NAME, MY_FUNCTIONS_FILE_NAME } from '../constants/constants';
import * as matrixAction from '../redux/matrix/matrixAction';
import * as envActions from '../redux/environment/environmentAction';
import store from '../redux/store';
import * as toast from './toast';
import { saveAs } from 'file-saver';

function updateWorkspace(dispatch, data) {
    dispatch(envActions.setWorkspaceFileData(data));
}

function loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {
        const functionDefinition = board.getFunctionDefinition();
        workspaceFileData.contenido = `incluir ${MY_FUNCTIONS_FILE_NAME}\n\n${functionDefinition.body}`;
        return services.editFile(workspaceFileData)
            .then((data) => {
                dispatch(matrixAction.setWorkspaceFunctionBody({ body: data.contenido }));
                updateWorkspace(dispatch, data);
                return webSocket.loadFile(userData, workspaceFileData.id, myFunctionsFileData.id)
            })
    }
}

export function evaluate(userData) {
    return (dispatch) => {
        const evalInst = board.getEvaluateFunction();
        const { environment } = store.getState();
        const { myFunctionsFileData } = environment;
        let loadFilePromise = Promise.resolve();
        if (evalInst.isFunction) {
            const { workspaceFileData } = environment;
            loadFilePromise = loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData)(dispatch);
        } else {
            loadFilePromise = webSocket.loadFile(userData, myFunctionsFileData.id);
        }
        loadFilePromise.then((message) => {
            dispatch(matrixAction.setEvalInstruction(evalInst.command))
            webSocket.evalExpression(userData, evalInst.command)
            .then((messages) => {
                board.setMateFunValue(messages)(dispatch);
            })
        });
    }
}

function findOrCreateFile(userData, name) {
    return services.getFiles(userData)
        .then((files) => {
            const file = files.find((file) => file.nombre === name);
            if (file) {
                return Promise.resolve(file);
            } else {
                const root = files.find((file) => file.nombre === 'root');
                return services.createFile(userData, name, root.id);
            }
        });
}

function loadMyFunctionFile(userData) {
    return findOrCreateFile(userData, MY_FUNCTIONS_FILE_NAME)
        .then((myFunctionsFileData) => {
            return myFunctionsFileData;
        });
} 


function loadWorkspaceFile(userData) {
    return findOrCreateFile(userData, WORKSPACE_FILE_NAME)
        .then((workspaceFileData) => {
            return workspaceFileData;
        });
}

function updateMyFunction(dispatch, data) {
    dispatch(envActions.setMyFunctionsFileData(data));
    const myFunctions = getCustomFunctionsByFile(data);
    board.getCompiler().setCustomFunctionsDefinition(myFunctions);
    dispatch(envActions.setMyFunctions(myFunctions));
}

function loadFiles(userData) {
    return (dispatch) => {
        loadMyFunctionFile(userData)
            .then((data) => updateMyFunction(dispatch, data))
            .then(() => {
                board.loadPendingBoard()(dispatch);
            });
        loadWorkspaceFile(userData)
            .then((data) => updateWorkspace(dispatch, data));
    }
}

export function prepareEnvironment(userData) {
    return (dispatch) => {
        webSocket.openConnection(userData);
        loadFiles(userData)(dispatch);
    }
}

const regexFunctionBlock = (name)=> RegExp(`{-FS:${name}-}(.|[\n\r])*{-FF:${name}-}`,'g');
const MATRIX_REGEX = /{-M:.*-}/;
//const FUNCTION_SING_REGEX = /\s*(\w+)\s?::\s?(.*)\s?->\s?(\w+)/g;
const ICON_REGEX = /{-I:([\w\d-]+)-}/g
const ATTR_REGEX = /{-A:(.*)-}/g
const RETURN_REGEX = /{-R:(.*)-}/g

function getCustomFunctionByName(name, contenido) {
    const functionBlockQuery = contenido.match(regexFunctionBlock(name));
    const functionBlock = functionBlockQuery[0];
    const metadataComment = functionBlock.match(MATRIX_REGEX)
    const metadata = metadataComment ? metadataComment[0].replace('{-M:', '').replace('-}', '') : undefined;
    const inTypesLine = functionBlock.match(ATTR_REGEX);
    const outLine = functionBlock.match(RETURN_REGEX);
    const inTypes = inTypesLine ? JSON.parse(ATTR_REGEX.exec(inTypesLine[0])[1]) : []
    const outType = outLine ? RETURN_REGEX.exec(outLine)[1] : '';
    const funcIconLine = functionBlock.match(ICON_REGEX)
    const icon = funcIconLine ? ICON_REGEX.exec(funcIconLine[0])[1] : '';
    return new CustomFuncPipe(name, inTypes, outType, metadata, icon);
}

function getCustomFunctionsByFile( myFunctionsFileData) {
    return getCustomFunctionsByText(myFunctionsFileData.contenido);
}

export function getCustomFunctionsByText(text) {
    const functionOpenBlock = text.match(/{-FS:([\w\d]+)-}/g);
    const functionNames = functionOpenBlock ? functionOpenBlock.map((name) => /{-FS:([\w\d]+)-}/.exec(name)[1]) : [];
    return functionNames.map((name) => getCustomFunctionByName(name, text));
}

export function cleanMyFunctions() {
    return (dispatch) => {
        const state = store.getState();
        const myFunctionsFileData = state.environment.myFunctionsFileData;
        const cleanMyFunctionsFileData = { ...myFunctionsFileData, contenido: '' }
        services.editFile(cleanMyFunctionsFileData)
            .then((data) => updateMyFunction(dispatch, data));
    }
}

function newFunctionBlock(name, icon) {
    const compiler = board.getCompiler();
    return getFunctionBlockByComplier(name, icon, compiler);
}

function getFunctionBlockByComplier(name, icon, compiler) {
    const matrixSnapshot = snapHelper.cleanSnapshotMatrixInfo(compiler.snapshot());
    const metadata = `{-M:${JSON.stringify(matrixSnapshot)}-}`;
    const functionDefinition = compiler.getFunctionDefinition(name);
    const initBlock = `{-FS:${name}-}`;
    const endBlock = `{-FF:${name}-}`;
    const iconInfo = icon ?`{-I:${icon}-}` : '';
    const attr = `{-A:${JSON.stringify(functionDefinition.attrs)}-}`;
    const ret = `{-R:${functionDefinition.ret}-}`;
    const code = functionDefinition.body;
    return `${initBlock}\n${iconInfo}\n${attr}\n${ret}\n${metadata}\n${code}\n${endBlock}\n`;
}

function getFunctionBlockByCustomSnapFunction(customSnap) {
    const name = customSnap.name;
    const icon = customSnap.icon;
    const compiler = new Compiler();
    const customMatrix = JSON.parse(customSnap.body);
    compiler.loadSnapMatrix(customMatrix);
    compiler.cleanLastValue();
    return getFunctionBlockByComplier(name, icon, compiler);
}

function filterErrorSystem(message) {
    return message.resultado.startsWith('OUT ') 
        && !message.resultado.startsWith('OUT -') 
        && !message.resultado.startsWith('OUTError:')
}

function editMyFunctionFile(newMyFunctionsFileData, dispatch) {
    const { myFunctionsFileData } = store.getState().environment;
    return services.editFile(newMyFunctionsFileData)
        .then((data) => {
            const { userData } = store.getState().user;
            return webSocket.loadFile(userData, data.id)
                .then((messages) => {
                    if(messages.find((message) => message.resultado.startsWith('OUTError:'))) {
                        const errorMessage = messages.filter((message) => filterErrorSystem(message))
                            .map(message => message.resultado.replace('OUT ', '').replace(/\..*/, ''));
                        return services.editFile(myFunctionsFileData)
                            .then(data => ({data, success:false, errorMessage}));
                    } else {
                        return { data, success: true }
                    }
                })
            })
            .then(({data, success, errorMessage}) => {
                updateMyFunction(dispatch, data);
                return success ? Promise.resolve(data) : Promise.reject(errorMessage);
            })
}

export function saveMyFunction(name, icon) {
    return (dispatch) => {
        const { myFunctionsFileData } = store.getState().environment
        const newMyFunctionFileData = {...myFunctionsFileData };
        const contenido = myFunctionsFileData.contenido;

        const functionOpenBlock = contenido.match(/{-FS:([\w\d]+)-}/g);
        const functionNames = functionOpenBlock ? functionOpenBlock.map((name) => /{-FS:([\w\d]+)-}/.exec(name)[1]) : [];
        const lastN = functionNames.filter((name) => /^func\d+$/.test(name))
                        .map((name) => Number(name.replace('func','')))
                        .reduce((n, m) => n > m ? n : m, 0)
        const funcName = name ? name : `func${lastN ? lastN + 1 : 1}`;

        if(!functionNames || functionNames.indexOf(funcName) === -1) {
            const myFunctionBlock = newFunctionBlock(funcName, icon);
            newMyFunctionFileData.contenido = `${contenido}\n${myFunctionBlock}`;
            editMyFunctionFile(newMyFunctionFileData, dispatch)
                .then(() => {
                    toast.createSuccessMessage('La función se creó con éxito', funcName);
                    board.clean()(dispatch);
                })
                .catch(() => {
                    toast.createErrorMessage('No se pudo crear la función. Revise las piezas con fondo amarillo', funcName);
                }) 
        } else {
            toast.createErrorMessage('No se pudo crear la función. Ya existe una función con ese nombre', funcName);
        }
    }
}

export function editMyFunction(name) {
    return (dispatch) => {
        const { myFunctionsFileData } = store.getState().environment
        const contenido = myFunctionsFileData.contenido;
        const functionOpenBlock = contenido.match(/{-FS:([\w\d]+)-}/g);
        const functionNames = functionOpenBlock ? functionOpenBlock.map((name) => /{-FS:([\w\d]+)-}/.exec(name)[1]) : [];
        if(name && functionNames.indexOf(name) !== -1) {
            const newMyFunctionFileData = {...myFunctionsFileData };
            const regexBlock = regexFunctionBlock(name);
            const oldBlock = regexBlock.exec(contenido)[0];
            const funcIconLine = oldBlock.match(ICON_REGEX)
            const oldIcon = funcIconLine ? ICON_REGEX.exec(funcIconLine[0])[1] : '';
            const newBlock = newFunctionBlock(name, oldIcon);
            newMyFunctionFileData.contenido = contenido.replace(regexBlock, newBlock);
            editMyFunctionFile(newMyFunctionFileData, dispatch)
                .then(() => {
                    toast.createSuccessMessage('La función se guardó con éxito', name);
                    board.cancelEdit()(dispatch);
                })
                .catch(() => {
                    toast.createErrorMessage('No se pudo guardar la función. Revise las piezas con fondo amarillo', name);
                })
        }
    }
}

export function deleteMyFunction(name) {
    return (dispatch) => {
        const { myFunctionsFileData } = store.getState().environment
        const newMyFunctionFileData = {...myFunctionsFileData };
        const contenido = myFunctionsFileData.contenido;
        newMyFunctionFileData.contenido = contenido.replace(regexFunctionBlock(name), '');
        editMyFunctionFile(newMyFunctionFileData, dispatch)
            .then(() => {
                toast.createSuccessMessage('La función se borró con éxito', name)
            })
            .catch(() => {
                toast.createErrorMessage('No se pudo borrar la función', name)
            })
    }
}

export function exportFunctions(name, snapCFuncs) {
    return (dispatch) => {
        const body = snapCFuncs.reduce((acc, snapCFunc) => {
            acc += getFunctionBlockByCustomSnapFunction(snapCFunc) + '\n';
            return acc;
        }, '');
        var blob = new Blob([body], {type: "text/plain;charset=utf-8"});
        saveAs(blob, name + ".mf");
    }
}

export function openImportModal() {
    return (dispatch) => {
        dispatch(envActions.openImportModal());
    }
}

export function closeImportModal() {
    return (dispatch) => {
        dispatch(envActions.closeImportModal());
    }
}

export function openExportModal() {
    return (dispatch) => {
        dispatch(envActions.openExportModal());
    }
}

export function closeExportModal() {
    return (dispatch) => {
        dispatch(envActions.closeExportModal());
    }
}

export function appendMyFunctions(name, text) {
    return (dispatch) => {
        const { myFunctionsFileData } = store.getState().environment
        const contenido = myFunctionsFileData.contenido;
        const newMyFunctionFileData = {...myFunctionsFileData };
        newMyFunctionFileData.contenido = `${contenido}\n${text}`;
        editMyFunctionFile(newMyFunctionFileData, dispatch)
            .then(() => {
                toast.createSuccessMessage('Se cargo con exito', name);
            })
            .catch((errorMessage) => {
                toast.createErrorMessage(
                    errorMessage.reduce((acc, message) => acc +'\n' + message, 'No se pudo cargar el archivo'), 
                    name
                );
            }) 
    }
}
