import { UPDATE_BOARD, SET_EVAL_INSTRUCTION, SET_WORKSPACE_FUNCTION_BODY } from './matrixActionTypes'

export const updateBoard = (snapshot) => {
    return {
        type: UPDATE_BOARD,
        payload: snapshot
    }
}

export const setEvalInstruction = (instruction) => {
    return {
        type: SET_EVAL_INSTRUCTION, 
        payload: instruction
    }
}

export const setWorkspaceFunctionBody = (funcProcess) => {
    return {
        type: SET_WORKSPACE_FUNCTION_BODY, 
        payload: funcProcess
    }
}