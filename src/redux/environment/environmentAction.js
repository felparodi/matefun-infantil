import * as actionType from './environmentActionTypes'

export const setWorkspaceFileData = (workspaceFileData) => {
    return {
        type: actionType.SET_WORKSPACE_FILE_DATA,
        payload: workspaceFileData
    }
}

export const setMyFunctionsFileData = (myFunctionsFileData) => {
    return {
        type: actionType.SET_MY_FUNCTIONS_FILE_DATA,
        payload: myFunctionsFileData
    }
}

export const setMyFunctions = (myFunctions) => {
    return {
        type: actionType.SET_MY_FUNCTIONS,
        payload: myFunctions
    }
}

export const openImportModal = () => {
    return {
        type: actionType.OPEN_IMPORT_MODAL
    }
}

export const closeImportModal = () => {
    return {
        type: actionType.CLOSE_IMPORT_MODAL
    }
}

export const openExportModal = () => {
    return {
        type: actionType.OPEN_EXPORT_MODAL
    }
}

export const closeExportModal = () => {
    return {
        type: actionType.CLOSE_EXPORT_MODAL
    }
}