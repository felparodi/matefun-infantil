import * as actionType from './matrixActionTypes'

export const updateBoard = (snapshot) => {
    return {
        type: actionType.UPDATE_BOARD,
        payload: snapshot
    }
}

export const setEvalInstruction = (instruction) => {
    return {
        type: actionType.SET_EVAL_INSTRUCTION, 
        payload: instruction
    }
}

export const setWorkspaceFunctionBody = (funcProcess) => {
    return {
        type: actionType.SET_WORKSPACE_FUNCTION_BODY, 
        payload: funcProcess
    }
}

export const setEditMode = (value, name) => {
    return {
        type: actionType.SET_EDIT_MODE,
        payload: { value, name }
    }
}