import { SET_WORKSPACE_FILE_DATA, SET_MY_FUNCTIONS_FILE_DATA } from './environmentActionTypes'

export const setWorkspaceFileData= (workspaceFileData) => {
    return {
        type: SET_WORKSPACE_FILE_DATA,
        payload: workspaceFileData
    }
}

export const setMyFunctionsFileData= (myFunctionsFileData) => {
    return {
        type: SET_MY_FUNCTIONS_FILE_DATA,
        payload: myFunctionsFileData
    }
}

