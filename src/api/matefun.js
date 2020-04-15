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

export function loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {
        const functionDefinition = getFunctionDefinition();
        workspaceFileData.contenido = `incluir ${MY_FUNCTIONS_FILE_NAME}\n\n${functionDefinition.body}`;
        return services.editFile(workspaceFileData)
            .then((data) => {
                dispatch(setWorkspaceFunctionBody({ body: data.contenido }));
                sessionStorage.setItem(WORKSPACE_FILE_STORAGE, JSON.stringify(data));
                dispatch(setWorkspaceFileData(data));
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
            sessionStorage.setItem(MY_FUNCTION_FILE_STORAGE, JSON.stringify(myFunctionsFileData));
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
            sessionStorage.setItem(WORKSPACE_FILE_STORAGE, JSON.stringify(workspaceFileData));
            return workspaceFileData;
        });
}

function loadFiles(userData) {
    return (dispatch) => {
        loadMyFunctionFile(userData)
            .then((myFunctionsFileData) => dispatch(setMyFunctionsFileData(myFunctionsFileData)));
        loadWorkspaceFile(userData)
            .then((workspaceFileData) => dispatch(setWorkspaceFileData(workspaceFileData)));
    }
}

export function prepareEnvironment(userData) {
    return (dispatch) => {
        webSocket.openConnection(userData);
        loadFiles(userData)(dispatch);
    }
}

function myFunctionsFileToToolboxPipes(dispatch, myFunctionsFileData) {

    var contenido = myFunctionsFileData.contenido;

    //console.log(contenido);

    var metadata= contenido.match(/{-.*-}/g);
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

export function saveInMyFunctions(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {
        debugger;
        var contenido= myFunctionsFileData.contenido;

        var metadata= contenido.match(/{-.*-}/g);
        
        var nombre= "func" + (metadata ? metadata.length+1 : 1);

        var snapshot = getMatrixSnapshot();
        var saveSnap = snapHelper.cleanSnapshotMatrixInfo(snapshot);

        var functionMetaData= {
            nombre: nombre,
            snapshot: saveSnap
        }

        const functionDefinition = getFunctionDefinition(nombre);

        var newContent= "{-" + JSON.stringify(functionMetaData) + "-}\n" + functionDefinition.body + "\n";

        workspaceFileData.contenido= '';
        
        myFunctionsFileData.contenido+= "\n\n" + newContent;
        
        services.editFile(myFunctionsFileData)
            .then((data) => {
                dispatch(setMyFunctionsFileData(data));
                myFunctionsFileToToolboxPipes(dispatch, data);
            })
    }
}