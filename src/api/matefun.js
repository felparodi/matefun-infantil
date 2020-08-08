//Aca la idea es tener los methodos mas propios de matefun
import * as services from '../server_connection/services';
import * as webSocket from '../server_connection/webSocket';
import * as snapHelper from '../classes/helpers/snapshot';
import { CustomFuncPipe } from '../classes/pipes/customFuncPipe'
import * as board from './board';
import { WORKSPACE_FILE_NAME, MY_FUNCTIONS_FILE_NAME } from '../constants/constants';
import * as matrixAction from '../redux/matrix/matrixAction';
import * as envActions from '../redux/environment/environmentAction';
import store from '../redux/store';
import * as toast from './toast';

function updateWorkspace(dispatch, data) {
    dispatch(envActions.setWorkspaceFileData(data));
}

export function loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {
        const functionDefinition = board.getFunctionDefinition();
        workspaceFileData.contenido = `incluir ${MY_FUNCTIONS_FILE_NAME}\n\n${functionDefinition.body}`;
        return services.editFile(workspaceFileData)
            .then((data) => {
                dispatch(matrixAction.setWorkspaceFunctionBody({ body: data.contenido }));
                updateWorkspace(dispatch, data);
                return webSocket.loadFile(userData, workspaceFileData.id, myFunctionsFileData.id)
            });
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
    myFunctionsFileToToolboxPipes(dispatch, data);
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
const COMMENT_REGEX = /{-.*-}/g;
//const FUNCTION_SING_REGEX = /\s*(\w+)\s?::\s?(.*)\s?->\s?(\w+)/g;
const ICON_REGEX = /{-I:([\w\d-]+)-}/g
const ATTR_REGEX = /{-A:(.*)-}/g
const RETURN_REGEX = /{-R:(.*)-}/g

function myFunctionsFileToToolboxPipes(dispatch, myFunctionsFileData) {

    const { contenido } = myFunctionsFileData;
    const functionOpenBlock = contenido.match(/{-FS:([\w\d]+)-}/g);
    const functionNames = functionOpenBlock ? functionOpenBlock.map((name) => /{-FS:([\w\d]+)-}/.exec(name)[1]) : [];

    const customFunctionDef = new Map();
    const myFunctions = functionNames.map((name) => {
        const functionBlockQuery = contenido.match(regexFunctionBlock(name));
        const functionBlock = functionBlockQuery[0];
        const metadataComment = functionBlock.match(MATRIX_REGEX)
        const metadata = metadataComment ? metadataComment[0].replace('{-M:', '').replace('-}', '') : undefined;
        const inTypesLine = functionBlock.match(ATTR_REGEX);
        const outLine = functionBlock.match(RETURN_REGEX);
        const inTypes = inTypesLine ? JSON.parse(ATTR_REGEX.exec(inTypesLine[0])[1]) : []
        const outType = outLine ? RETURN_REGEX.exec(outLine)[1] : '';
        //const cleanComments = functionBlock.replace(COMMENT_REGEX, '').trim();
        //const functionRegex = FUNCTION_SING_REGEX.exec(cleanComments.match(FUNCTION_SING_REGEX)[0]);
        //const inType = functionRegex[2].match(/(R|Color|\(R X R\)|Fig|A)\*?/g).map((type) => typeHelper.getMateFunPipeType(type));
        //const outType = typeHelper.getMateFunPipeType(functionRegex[3].trim());
        const funcIconLine = functionBlock.match(ICON_REGEX)
        const icon = funcIconLine ? ICON_REGEX.exec(funcIconLine[0])[1] : '';
        customFunctionDef.set(name, { inTypes, outType, metadata, icon });
        return new CustomFuncPipe(name, inTypes, outType, metadata, icon);
    })


    board.getCompiler().setCustomFunctionsDefinition(customFunctionDef);
    dispatch(envActions.setMyFunctions(myFunctions));
}

export function cleanMyFunctions() {
    return (dispatch) => {
        const state = store.getState();
        const myFunctionsFileData = state.environment.myFunctionsFileData;
        const cleanMyFunctionsFileData = { ...myFunctionsFileData, contenido: '' }
        services.editFile(cleanMyFunctionsFileData)
            .then((data) => {
                updateMyFunction(dispatch, data);
                myFunctionsFileToToolboxPipes(dispatch, data);
            })
    }
}

function newFunctionBlock(name, icon) {
    const matrix = store.getState().matrix.board;
    const matrixSnapshot = snapHelper.cleanSnapshotMatrixInfo({matrix});
    const metadata = `{-M:${JSON.stringify(matrixSnapshot)}-}`;
    const functionDefinition = board.getFunctionDefinition(name);
    const initBlock = `{-FS:${name}-}`;
    const endBlock = `{-FF:${name}-}`;
    const iconInfo = icon ?`{-I:${icon}-}` : '';
    const attr = `{-A:${JSON.stringify(functionDefinition.attrs)}-}`;
    const ret = `{-R:${functionDefinition.ret}-}`;
    const code = functionDefinition.body;
    return `${initBlock}\n${iconInfo}\n${attr}\n${ret}\n${metadata}\n${code}\n${endBlock}\n`;
}

function editMyFunctionFile(newMyFunctionsFileData, dispatch) {
    const { myFunctionsFileData } = store.getState().environment;
    return services.editFile(newMyFunctionsFileData)
        .then((data) => {
            const { userData } = store.getState().user;
            return webSocket.loadFile(userData, data.id)
                .then((messages) => {
                    if(messages.find((message) => message.resultado.startsWith('OUTError:'))) {
                        console.error(messages)
                        return services.editFile(myFunctionsFileData)
                            .then(data => ({data, success:false}));
                    } else {
                        return { data, success: true }
                    }
                })
            })
            .then(({data, success}) => {
                updateMyFunction(dispatch, data);
                myFunctionsFileToToolboxPipes(dispatch, data);
                return success ? Promise.resolve(data) : Promise.reject(data);
            })
}

export function saveMyFunction(name, icon) {
    return (dispatch) => {
        const { myFunctionsFileData } = store.getState().environment
        const newMyFunctionFileData = {...myFunctionsFileData };
        const contenido = myFunctionsFileData.contenido;

        const functionOpenBlock = contenido.match(/{-FS:([\w\d]+)-}/g);
        const functionNames = functionOpenBlock ? functionOpenBlock.map((name) => /{-FS:([\w\d]+)-}/.exec(name)[1]) : [];
        const lastN = functionNames.map((name) => Number(name.replace('func','')))
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


