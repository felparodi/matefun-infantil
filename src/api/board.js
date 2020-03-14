import * as matrixAction from '../redux/matrix/actionTypes';
import { MatrixPipe } from '../classes/matrix';
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants';
import * as services from '../services';
import {createPipeToSnap} from '../classes/helpers/pipeSnap';

let matrix = new MatrixPipe(BOARD_ROWS, BOARD_COLS);

export function dropPipe(drop) {
    return (dispatch) => {
        const {origin, pos, dropEffect, pipe} = drop;
        if(origin === 'board') {
            if(!pipe.pos || dropEffect === 'copy') {
                matrix.addPipe(pos.x, pos.y, createPipeToSnap(pipe));
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
        services.editarWorkspace(funcProcess.body);
        dispatch({
            type:matrixAction.SET_WORKSPACE_FUNCTION_BODY, 
            payload: funcProcess
        });
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
            updateMatrix(dispatch);
        })
    }
}

function updateMatrix(dispatch) {
    dispatch({
        type:matrixAction.UPDATE_BOARD,
        payload: matrix.snapshot()
    });
}
