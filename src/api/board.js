import * as matrixAction from '../redux/matrix/actionTypes';
import { MatrixPipe } from '../classes/matrix';
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants';
import * as services from '../services';
import * as snapHelper from '../classes/helpers/snapshot';

let matrix = new MatrixPipe(BOARD_ROWS, BOARD_COLS);
let joinList = {start: null, end:null }

export function loadPenndingBoard() {
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

export function process() {
    return (dispatch) => {
        const funcProcess = matrix.process();
        dispatch({
            type:matrixAction.SET_WORKSPACE_FUNCTION_BODY, 
            payload: funcProcess
        });
        return services.editarWorkspace(funcProcess.body)
            .then((fileData) => {
                const { message } = fileData;
                dispatch({type:matrixAction.SET_RESULT_EVAL, payload:message.resultado})
                return (fileData);
            });
        
    }
}

export function processEval() {
    return(dispatch) => {
        return process()(dispatch)
            .then((a) => {
                return evaluate()(dispatch)
            })
    }
}

export function evaluate() {
    return (dispatch) => {
        const instruction = matrix.evaluateFunction();
        dispatch({
            type:matrixAction.SET_EVAL_INSTRUCTION, 
            payload: instruction
        });
        services.sendCommand(instruction).then((message) => {
            matrix.setMateFunValue(message);
            dispatch({type:matrixAction.SET_RESULT_EVAL, payload:message.resultado})
            updateMatrix(dispatch);
        })
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
        matrix.addWorkPipe({x, y});
        updateMatrix(dispatch);
    }
}

export function join(j1, j2) {
    return (dispatch) => {
        matrix.join(j1, j2);
        updateMatrix(dispatch)
    }
}

export function joinInput(j1) {
    return (dispatch) => {
        joinList.end = j1;
        if(joinList.start && joinList.end) {
            matrix.join(joinList.start, joinList.end);
            joinList = {start: null, end: null}
            updateMatrix(dispatch)
        }
    }
}

export function joinOutput(j2) {
    return (dispatch) => {
        joinList.start = j2;
        if(joinList.start && joinList.end) {
            matrix.join(joinList.start, joinList.end);
            joinList = {start: null, end: null}
            updateMatrix(dispatch)
        }
    }
}

function updateMatrix(dispatch) {
    return new Promise(() => {
        const snapshot = matrix.snapshot();
        const saveSnap = snapHelper.cleanSnapshotMatrixInfo(snapshot);
        localStorage.setItem('matrix', JSON.stringify(saveSnap));
        dispatch({
            type:matrixAction.UPDATE_BOARD,
            payload: snapshot
        });
    });
}
