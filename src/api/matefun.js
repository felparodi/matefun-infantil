//Aca la idea es tener los methodos mas propios de matefun
import * as services from '../server_connection/services';
import * as webSocket from '../server_connection/webSocket';
import { setMateFunValue, getEvaluateFunction, getFunctionDefinition, getMatrixSnapshot } from './board';
import { WORKSPACE_FILE_NAME, MYFUNCTIONS_FILE_NAME } from '../constants/constants';
import { setEvalInstruction, setWorkspaceFunctionBody } from '../redux/matrix/matrixAction';
import { setWorkspaceFileData, setMyFunctionsFileData, setMyFunctions } from '../redux/environment/environmentAction';

export function loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {
        services.getFiles(userData).then(console.log)
        const functionDefinition = getFunctionDefinition();
        workspaceFileData.contenido = `incluir ${MYFUNCTIONS_FILE_NAME}\n\n${functionDefinition.body}`;
        services.editFile(workspaceFileData)
        .then((data) => {
            console.log(data);
            dispatch(setWorkspaceFunctionBody({ body: data.contenido }));
            dispatch(setWorkspaceFileData(data));
            webSocket.loadFile(userData, workspaceFileData.id, myFunctionsFileData.id)
        });
    }
}

export function evaluate(userData) {
    return (dispatch) => {
        const instruction = getEvaluateFunction();
        dispatch(setEvalInstruction(instruction));
        webSocket.evalExpression(userData, instruction)
        .then((messages) => {
            setMateFunValue(messages)(dispatch);
        })
    }
}

export function prepareEnvironment(userData) {
    return (dispatch) => {
        webSocket.openConnection(userData);
        services.getFiles(userData)
        .then((files) => {

            var myFunctionsFileData = files.find((file) => file.nombre === MYFUNCTIONS_FILE_NAME);
            if (myFunctionsFileData) {
                dispatch(setMyFunctionsFileData(myFunctionsFileData));
                myFunctionsFileToToolboxPipes(dispatch, myFunctionsFileData);
            } else {
                services.createFile(userData, MYFUNCTIONS_FILE_NAME)
                .then(
                    (myFunctionsFileData) => {
                        dispatch(setMyFunctionsFileData(myFunctionsFileData))
                    }
                );
            }

            var workspaceFileData = files.find((file) => file.nombre === WORKSPACE_FILE_NAME);
            if (workspaceFileData) {
                dispatch(setWorkspaceFileData(workspaceFileData))
            } else {
                services.createFile(userData, WORKSPACE_FILE_NAME)
                .then(
                    (workspaceFileData) => {
                        dispatch(setWorkspaceFileData(workspaceFileData))
                    }
                );
            } 
        });
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
        
        services.editFile(workspaceFileData)
        .then(() => {
            dispatch(setWorkspaceFunctionBody(functionDefinition));
            dispatch(setWorkspaceFileData(workspaceFileData));

            services.editFile(myFunctionsFileData)
            .then(()=> {
                dispatch(setMyFunctionsFileData(myFunctionsFileData));

                webSocket.loadFile(userData, workspaceFileData.id, myFunctionsFileData.id); 
                
                myFunctionsFileToToolboxPipes(dispatch, myFunctionsFileData);

                cleanAux(dispatch);        
            })
        })
    }
}