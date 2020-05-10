
import * as matrixAction from '../redux/matrix/matrixActionTypes';
import Compiler from '../classes/compiler';
import { MatrixPipe, equalsPos as equalsPos } from '../classes/matrix';
import { BOARD_ROWS, BOARD_COLS, PIPE_TYPES } from '../constants/constants';
import * as snapHelper from '../classes/helpers/snapshot';
import * as actions from '../redux/matrix/matrixAction';
import store from '../redux/store';

const compiler = new Compiler();
compiler.newMatrix(BOARD_ROWS, BOARD_COLS);

let joinList = { start: null, end:null }

export function loadPendingBoard() {
    return (dispatch) => {
        const matrixJSON = sessionStorage.getItem('matrix');
        if (matrixJSON) {
            const savedMatrix = JSON.parse(matrixJSON);
            compiler.loadSnapMatrix(savedMatrix);
        }
        updateMatrix(dispatch);
    }
}

export function dropPipe(drop) {
    return (dispatch) => {
        const { isEditMode } = store.getState().matrix
        const { origin, pos, dropEffect, pipe } = drop;
        if(origin === 'board') {
            if(!pipe.pos || dropEffect === 'copy') {
                compiler.addSnapPipeToMatrix(pos.x, pos.y, pipe);
            } else if (dropEffect === 'move') {
                compiler.getMatrix().moverPipe(pos.x, pos.y, pipe.pos);
            }
        } else {
            if(pipe.pos) {
                compiler.getMatrix().removePipe(pipe.pos.x, pipe.pos.y);
            }
        }
        updateMatrix(dispatch, isEditMode);
    }
}

export function setPipeValue(x, y, value) {
    return (dispatch) => {
        const { isEditMode } = store.getState().matrix
        compiler.getMatrix().setPipeValue(x, y, value);
        updateMatrix(dispatch, isEditMode);
    }
}

export function clean() {
    return (dispatch) => {
        dispatch(actions.setEditMode(false));
        cleanAux(dispatch);
    }
}

function cleanAux(dispatch) {
    compiler.getMatrix().clean();
    updateMatrix(dispatch);
}

export function startWork() {
    return (dispatch) => {
        const { isEditMode } = store.getState().matrix;
        compiler.getMatrix().startWork();
        updateMatrix(dispatch, isEditMode);
    }
}

export function addWorkingPipe(x, y) {
    return (dispatch) => {
        const { isEditMode } = store.getState().matrix;
        compiler.getMatrix().addWorkPipe({x, y});
        updateMatrix(dispatch, isEditMode);
    }
}

export function join(j1, j2) {
    return (dispatch) => {
        const { isEditMode } = store.getState().matrix;
        compiler.getMatrix().join(j1, j2);
        updateMatrix(dispatch, isEditMode);
    }
}

export function isEqualJoin(j1, j2) {
    return (!j1 && !j2) || (equalsPos(j1, j2) && j1.dir === j2.dir)
}

export function joinInput(j1) {
    return (dispatch) => {
        joinList.end = isEqualJoin(joinList.end, j1) ? null : j1;
        if(equalsPos(joinList.start, joinList.end)){
            joinList.start = null;
            dispatch({type: matrixAction.SET_START_JOIN, payload: null })
        }
        dispatch({type: matrixAction.SET_END_JOIN, payload: joinList.end })
        tryJoin(dispatch);
    }
}

function tryJoin(dispatch) {
    return new Promise(() => {
        if(joinList.start && joinList.end) {
            compiler.getMatrix().join(joinList.start, joinList.end);
            joinList = {start: null, end: null}
            dispatch({type: matrixAction.CLEAN_JOIN});
            updateMatrix(dispatch);
        }
        return Promise.resolve();
    })
}

export function joinOutput(j2) {
    return (dispatch) => {
        joinList.start = isEqualJoin(joinList.start, j2) ? null : j2;
        if(equalsPos(joinList.start, joinList.end)){
            joinList.end = null;
            dispatch({type: matrixAction.SET_END_JOIN, payload: null })
        }
        dispatch({type: matrixAction.SET_START_JOIN, payload: joinList.start })
        tryJoin(dispatch);
    }
}

export function setMateFunValue(value) {
    return (dispatch) => {
        setMateFunValueAux(dispatch, value);
    }
}

function setMateFunValueAux(dispatch, value) {
    compiler.getMatrix().setMateFunValue(value);
    updateMatrix(dispatch);
}

function updateMatrix(dispatch, isEditMode) {
    const snapshot = compiler.snapshot();
    if(!isEditMode) {
        const saveSnap = snapHelper.cleanSnapshotMatrixInfo(snapshot);
        sessionStorage.setItem('matrix', JSON.stringify(saveSnap));
    }
    dispatch(actions.updateBoard(snapshot));
}

export function getEvaluateFunction() {
    return compiler.evaluateFunction()
}

export function getFunctionDefinition(name) {
    return compiler.getFunctionDefinition(name)
}

export function cancelEdit() {
    return (dispatch) => {
        dispatch(actions.setEditMode(false));
        loadPendingBoard()(dispatch);
    }
}

export function editCustomFunction(customFuncSnap) {
    return (dispatch) => {
        console.log(customFuncSnap);
        if(customFuncSnap.type === PIPE_TYPES.CUSTOM) {
            const customMatrix = JSON.parse(customFuncSnap.body);
            compiler.loadSnapMatrix(customMatrix);
            dispatch(actions.setEditMode(true, customFuncSnap.name));
            updateMatrix(dispatch, true);
        }
    }
}
