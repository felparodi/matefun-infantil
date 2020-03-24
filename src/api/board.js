import * as matrixAction from '../redux/matrix/matrixActionTypes';
import { MatrixPipe } from '../classes/matrix';
import { BOARD_ROWS, BOARD_COLS, WORKSPACE_FILE_NAME, MYFUNCTIONS_FILE_NAME } from '../constants/constants';
import * as services from '../server_connection/services';
import * as webSocket from '../server_connection/webSocket';
import * as snapHelper from '../classes/helpers/snapshot';
import { updateBoard, setEvalInstruction, setWorkspaceFunctionBody } from '../redux/matrix/matrixAction';
import { setWorkspaceFileData, setMyFunctionsFileData } from '../redux/environment/environmentAction';

let matrix = new MatrixPipe(BOARD_ROWS, BOARD_COLS);

export function loadPendingBoard() {
    return (dispatch) => {
        const matrixJSON = localStorage.getItem('matrix');
        if (matrixJSON) {
            const savedMatrix = JSON.parse(matrixJSON);
            matrix = new MatrixPipe(savedMatrix.size.x, savedMatrix.size.y);
            const pipesBulck = savedMatrix.pipes.map((snapPipe) => ({
                    pos: snapPipe.pos,
                    pipe: snapHelper.createPipeToSnap(snapPipe)
            }))
            matrix.addPipeBulck(pipesBulck);
        }
        updateMatrix(dispatch);
    }
}

export function dropPipe(drop) {
    return (dispatch) => {
        const {origin, pos, dropEffect, pipe} = drop;
        if(origin === 'board') {
            if(!pipe.pos || dropEffect === 'copy') {
                matrix.addPipe(pos.x, pos.y, snapHelper.createPipeToSnap(pipe));
            } else if (dropEffect === 'move') {
                matrix.moverPipe(pos.x, pos.y, pipe.pos);
            }
        } else if(origin === 'toolbox') {
            if(pipe.pos) {
                matrix.removePipe(pipe.pos.x, pipe.pos.y);
            }
        }
        updateMatrix(dispatch);
    }
}

export function setPipeValue(x, y, value) {
    return (dispatch) => {
        matrix.setPipeValue(x, y, value);
        updateMatrix(dispatch);
    }
}

export function loadFunctionDefinition(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {
        const functionDefinition = matrix.getFunctionDefinition();
        workspaceFileData.contenido= functionDefinition.body;
        services.editarArchivo(workspaceFileData, () => {
            dispatch(setWorkspaceFunctionBody(functionDefinition));
            dispatch(setWorkspaceFileData(workspaceFileData));
            webSocket.cargarArchivo(userData, workspaceFileData.id, myFunctionsFileData.id); 
        })
    }
}

export function evaluate(userData) {
    return (dispatch) => {
        const instruction = matrix.evaluateFunction();
        dispatch(setEvalInstruction(instruction));
        webSocket.evaluarExpresion(userData, instruction)
    }
}

export function clean() {
    return (dispatch) => {
       matrix = new MatrixPipe(BOARD_ROWS, BOARD_COLS);
       updateMatrix(dispatch);
    }
}

export function startWork() {
    return (dispatch) => {
        matrix.startWork();
        updateMatrix(dispatch);
    }
}

export function endWork() {
    return (dispatch) => {
        matrix.endWork();
        updateMatrix(dispatch);
    }
}

export function addWorkingPipe(x, y) {
    return (dispatch) => {
        matrix.addWorkPipe(x, y);
        updateMatrix(dispatch);
    }
}

export function setMateFunValue(value) {
    return (dispatch) => {
        matrix.setMateFunValue(value);
        updateMatrix(dispatch);
    }
}

function updateMatrix(dispatch) {
    const snapshot = matrix.snapshot();
    const saveSnap = snapHelper.cleanSnapshotMatrixInfo(snapshot);
    localStorage.setItem('matrix', JSON.stringify(saveSnap));
    dispatch(updateBoard(snapshot));
}

export function prepareEnvironment(userData) {

    return (dispatch) => {

        services.getArchivos(userData.cedula, (files) => {
            
            var workspaceFileData = files.find((file) => file.nombre == WORKSPACE_FILE_NAME);
            if (typeof workspaceFileData !== "undefined") {
                dispatch(setWorkspaceFileData(workspaceFileData))
            } else {
                services.crearArchivo(WORKSPACE_FILE_NAME,
                    (workspaceFileData) => {
                        dispatch(setWorkspaceFileData(workspaceFileData))
                    }
                );
            }
            var myFunctionsFileData = files.find((file) => file.nombre == MYFUNCTIONS_FILE_NAME);
            if (typeof myFunctionsFileData !== "undefined") {
                dispatch(setMyFunctionsFileData(myFunctionsFileData))
            } else {
                services.crearArchivo(MYFUNCTIONS_FILE_NAME,
                    (myFunctionsFileData) => {
                        dispatch(setMyFunctionsFileData(myFunctionsFileData))
                    }
                );
            }
        })

        webSocket.abrirConexion(userData, (message) => {
            matrix.setMateFunValue(message);
            updateMatrix(dispatch);
        });
    }
}

export function saveInMyFunctions(userData, workspaceFileData, myFunctionsFileData) {
    return (dispatch) => {

        var functionMetaData= {
            nombre: "funcionLucia1",
            icono: "icono123"
        }

        const functionDefinition = matrix.getFunctionDefinition();

        var newContent= "{-" + JSON.stringify(functionMetaData) + "-} \n" + functionDefinition.body + "\n";

        workspaceFileData.contenido= '';
        
        myFunctionsFileData.contenido+= newContent;
        
        services.editarArchivo(workspaceFileData, () => {
            dispatch(setWorkspaceFunctionBody(functionDefinition));
            dispatch(setWorkspaceFileData(workspaceFileData));

            services.editarArchivo(myFunctionsFileData, ()=> {
                dispatch(setMyFunctionsFileData(myFunctionsFileData));

                webSocket.cargarArchivo(userData, workspaceFileData.id, myFunctionsFileData.id); 
            })
        })
    }
}