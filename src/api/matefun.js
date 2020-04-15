//Aca la idea es tener los methodos mas propios de matefun
import * as services from '../server_connection/services';
import * as webSocket from '../server_connection/webSocket';
import * as snapHelper from '../classes/helpers/snapshot';
import { setMateFunValue, getEvaluateFunction, matrixFromSnapshot, getFunctionDefinition, getMatrixSnapshot } from './board';
import { WORKSPACE_FILE_NAME, MY_FUNCTIONS_FILE_NAME } from '../constants/constants';
import { setEvalInstruction, setWorkspaceFunctionBody } from '../redux/matrix/matrixAction';
import { setWorkspaceFileData, setMyFunctionsFileData, setMyFunctions } from '../redux/environment/environmentAction';
import store from '../redux/store';

const MY_FUNCTION_FILE_STORAGE = 'MY_FUNCTION_FILE_STORAGE';
const WORKSPACE_FILE_STORAGE = 'WORKSPACE_FILE_STORAGE';

function updateWorkspace(dispatch, data) {
    dispatch(setWorkspaceFileData(data));
    sessionStorage.setItem(WORKSPACE_FILE_STORAGE, JSON.stringify(data));
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
                return services.createFile(userData, name);
            }
        });
}

function loadMyFunctionFile(userData) {
    const myFunctionsFileDataJSON = sessionStorage.getItem(MY_FUNCTION_FILE_STORAGE);
    if(myFunctionsFileDataJSON) {
        return Promise.resolve(JSON.parse(myFunctionsFileDataJSON));
    }
    return findOrCreateFile(userData, MY_FUNCTIONS_FILE_NAME)
        .then((myFunctionsFileData) => {
            return myFunctionsFileData;
        });
} 


function loadWorkspaceFile(userData) {
    const workspaceFileDataJSON = sessionStorage.getItem(WORKSPACE_FILE_STORAGE);
    if(workspaceFileDataJSON) {
        return Promise.resolve(JSON.parse(workspaceFileDataJSON));
    }
    return findOrCreateFile(userData, WORKSPACE_FILE_NAME)
        .then((workspaceFileData) => {
            return workspaceFileData;
        });
}

function updateMyFunction(dispatch, data) {
    dispatch(setMyFunctionsFileData(data));
    sessionStorage.setItem(MY_FUNCTION_FILE_STORAGE, JSON.stringify(data));
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

const METADATA_REGEX = /{-.*-}/g;
const COMMENT_REGEX = /{-.*-}/;
const FUNCTION_SING_REGEX = /\s*(\w+)\s?::\s?(\w+)\s?->\s?(\w+)/g;

function myFunctionsFileToToolboxPipes(dispatch, myFunctionsFileData) {
    debugger;
    var contenido = myFunctionsFileData.contenido;

    //console.log(contenido);

    var metadata= contenido.match(METADATA_REGEX);
    var c = contenido.replace(COMMENT_REGEX, "").match(FUNCTION_SING_REGEX);
    //console.log(metadata);

    var functions= contenido.split(/{-.*-}\n/);
    functions.shift();
    //console.log(functions);

    var signatures= functions.map(func => {
        var i= func.indexOf("\n");
        return func.substring(0,i);
    })
    //console.log(signatures);

    var equations= functions.map(func => {
        var i= func.indexOf("\n")+1;
        return func.substring(i);
    })
    //console.log(equations);0

    var mfFunctions= [];
    if(metadata) {
        for (var i=0; i<metadata.length; i++){
            //quito apertura y cierre de comentarios {- y -}
            var md= metadata[i].substring(2,metadata[i].length-2);
            
            var mdJson = JSON.parse(md);
            var name= mdJson.nombre;
            var snapshot= mdJson.snapshot;

            var matrixAux= matrixFromSnapshot(snapshot);
            var pipe= matrixAux.getFunctionPipe(name);
            
            mfFunctions.push({
                name: mdJson.nombre,
                snapshot: mdJson.snapshot,
                signature: signatures[i],
                equation: equations[i],
                pipe: pipe
            })
        }
    }
    console.log(mfFunctions);
    dispatch(setMyFunctions(mfFunctions));
}

function metadataSerialize(name, snapshot) {
    var saveSnap = snapHelper.cleanSnapshotMatrixInfo(snapshot);
    var metadata = {
        nombre: name,
        snapshot: saveSnap
    }
    return `{-${JSON.stringify(metadata)}-}`;
}

export function saveInMyFunctions(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {

        const contenido = myFunctionsFileData.contenido;
        const metadata = contenido.match(METADATA_REGEX);
        const name = "func" + (metadata ? metadata.length + 1 : 1);
        const newMetadata = metadataSerialize(name, getMatrixSnapshot());
        const functionDefinition = getFunctionDefinition(name);
        
        myFunctionsFileData.contenido += `\n${newMetadata}\n${functionDefinition.body}\n`;;
    
        services.editFile(myFunctionsFileData)
            .then((data) => {
                updateMyFunction(dispatch, data);
                myFunctionsFileToToolboxPipes(dispatch, data);
            })
    }
}