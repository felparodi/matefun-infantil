//Aca la idea es tener los methodos mas propios de matefun
import * as services from '../server_connection/services';
import * as webSocket from '../server_connection/webSocket';
import * as snapHelper from '../classes/helpers/snapshot';
import * as typeHelper from '../classes/helpers/type';
import { CustomFuncPipe } from '../classes/pipes/customFuncPipe'
import { setMateFunValue, getEvaluateFunction, getFunctionDefinition, getMatrixSnapshot } from './board';
import { WORKSPACE_FILE_NAME, MY_FUNCTIONS_FILE_NAME } from '../constants/constants';
import { setEvalInstruction, setWorkspaceFunctionBody } from '../redux/matrix/matrixAction';
import { setWorkspaceFileData, setMyFunctionsFileData, setMyFunctions } from '../redux/environment/environmentAction';
import store from '../redux/store';
import * as tost from './toast';
import { Toast } from 'react-bootstrap';

function updateWorkspace(dispatch, data) {
    dispatch(setWorkspaceFileData(data));
}

export function loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {
        const functionDefinition = getFunctionDefinition();
        workspaceFileData.contenido = `incluir ${MY_FUNCTIONS_FILE_NAME}\n\n${functionDefinition.body}`;
        return services.editFile(workspaceFileData)
            .then((data) => {
                dispatch(setWorkspaceFunctionBody({ body: data.contenido }));
                updateWorkspace(dispatch, data);
                return webSocket.loadFile(userData, workspaceFileData.id, myFunctionsFileData.id)
            });
    }
}

export function evaluate(userData) {
    return (dispatch) => {
        const evalInst = getEvaluateFunction();
        const { environment } = store.getState();
        const { myFunctionsFileData } = environment;
        let loadFilePromise;
        if (evalInst.isFunction) {
            const { workspaceFileData } = environment;
            loadFilePromise = loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData)(dispatch);
        } else {
            loadFilePromise = webSocket.loadFile(userData, myFunctionsFileData.id);
        }
        loadFilePromise.then((message) => {
            dispatch(setEvalInstruction(evalInst.command))
            webSocket.evalExpression(userData, evalInst.command)
            .then((messages) => {
                setMateFunValue(messages)(dispatch);
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
    dispatch(setMyFunctionsFileData(data));
    myFunctionsFileToToolboxPipes(dispatch, data);
}

function loadFiles(userData) {
    return (dispatch) => {
        loadMyFunctionFile(userData)
            .then((data) => updateMyFunction(dispatch, data));
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
const METADATA_REGEX = /{-M:.*-}/;
const COMMENT_REGEX = /{-.*-}/g;
const FUNCTION_SING_REGEX = /\s*(\w+)\s?::\s?(.*)\s?->\s?(\w+)/g;

function myFunctionsFileToToolboxPipes(dispatch, myFunctionsFileData) {

    const { contenido } = myFunctionsFileData;
    const functionOpenBlock = contenido.match(/{-FS:([\w\d]+)-}/g);
    const functionNames = functionOpenBlock ? functionOpenBlock.map((name) => /{-FS:([\w\d]+)-}/.exec(name)[1]) : [];

    const myFunctions = functionNames.map((name) => {
        const functionBlock = contenido.match(regexFunctionBlock(name));
        const metadataComment = functionBlock[0].match(METADATA_REGEX)
        const metadata = metadataComment ? metadataComment[0].replace('{-M:', '').replace('-}', '') : undefined;
        const cleanComments = functionBlock[0].replace(COMMENT_REGEX, '').trim();
        const functionRegex = FUNCTION_SING_REGEX.exec(cleanComments.match(FUNCTION_SING_REGEX)[0]);
        const inType = functionRegex[2].match(/(R|Color|\(R X R\)|Fig|A)\*?/g).map((type) => typeHelper.getMateFunPipeType(type));
        const outType = typeHelper.getMateFunPipeType(functionRegex[3].trim());
        return new CustomFuncPipe(name, inType, outType, metadata);
    })

    dispatch(setMyFunctions(myFunctions));
}

function metadataSerialize(name, snapshot) {
    var saveSnap = snapHelper.cleanSnapshotMatrixInfo(snapshot);
    var metadata = {
        nombre: name,
        snapshot: saveSnap
    }
    return `{-M:${JSON.stringify(metadata)}-}`;
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

function newFunctionBlock(name) {
    const functionMetadata = metadataSerialize(name, getMatrixSnapshot());
    const functionDefinition = getFunctionDefinition(name);
    return `{-FS:${name}-}\n${functionMetadata}\n${functionDefinition.body}\n{-FF:${name}-}`;
}

export function saveInMyFunctions(name) {
    return (dispatch) => {
        const { myFunctionsFileData } = store.getState().environment
        const newMyFunctionFileData = {...myFunctionsFileData };
        const contenido = myFunctionsFileData.contenido;

        const functionOpenBlock = contenido.match(/{-FS:([\w\d]+)-}/g);
        const functionNames = functionOpenBlock ? functionOpenBlock.map((name) => /{-FS:([\w\d]+)-}/.exec(name)[1]) : [];
        const funcName = name ? name : `func${functionNames ? functionNames.length + 1 : 1}`;

        if(!functionNames || functionNames.indexOf(funcName) === -1) {
            const myFunctionBlock = newFunctionBlock(funcName);
            newMyFunctionFileData.contenido = `${contenido}\n${myFunctionBlock}`;
            services.editFile(newMyFunctionFileData)
                .then((data) => {
                    const { userData } = store.getState().user;
                    return webSocket.loadFile(userData, data.id)
                        .then((messages) => {
                            if(messages.find((message) => message.resultado.startsWith('OUTError:'))) {
                                console.error(messages)
                                tost.createErrorMessage('No se pudo crear la funcion, revice las piesas con fondo amarillo', funcName)
                                return services.editFile(myFunctionsFileData);
                            } else {
                                tost.createSuccessMessage('Se creo con extito la nueva funcion', funcName)
                                return data
                            }
                        })
                })
                .then((data) => {
                    updateMyFunction(dispatch, data);
                    myFunctionsFileToToolboxPipes(dispatch, data);
                })
                
        } else {
            tost.createErrorMessage('No se pudo crear la funcion, ya existe una funcion con ese nombre', funcName)
        }
    }
}

export function deleteMyFunctions(name) {
    return (dispatch) => {
        const { myFunctionsFileData } = store.getState().environment
        const newMyFunctionFileData = {...myFunctionsFileData };
        const contenido = myFunctionsFileData.contenido;
        newMyFunctionFileData.contenido = contenido.replace(regexFunctionBlock(name), '');
        services.editFile(newMyFunctionFileData)
        .then((data) => {
            const { userData } = store.getState().user;
            return webSocket.loadFile(userData, data.id)
                .then((messages) => {
                    if(messages.find((message) => message.resultado.startsWith('OUTError:'))) {
                        console.error(messages)
                        tost.createErrorMessage('No se pudo borrar la funcion', name)
                        return services.editFile(myFunctionsFileData);
                    } else {
                        Toast.createSuccessMessage('Se a borrado la funcion', name)
                        return data
                    }
                })
            })
            .then((data) => {
                updateMyFunction(dispatch, data);
                myFunctionsFileToToolboxPipes(dispatch, data);
            })
    }
}
