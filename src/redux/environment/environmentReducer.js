import * as actionTypes from './environmentActionTypes';

export const initialState = {
    workspaceFileData: null,
    myFunctionsFileData: null,
    myFunctions: [],
    modalImport: false,
    modalExport: false
};

export default function environmentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_WORKSPACE_FILE_DATA: {
      const workspaceFileData = action.payload;
      return {
        ...state, 
        workspaceFileData: workspaceFileData,
      };
    }
    case actionTypes.SET_MY_FUNCTIONS_FILE_DATA : {
      const myFunctionsFileData = action.payload;
      return {
        ...state, 
        myFunctionsFileData: myFunctionsFileData,
      };
    }
    case actionTypes.SET_MY_FUNCTIONS : {
      const myFunctions = action.payload;
      return {
        ...state, 
        myFunctions: myFunctions,
      };
    }
    case actionTypes.OPEN_EXPORT_MODAL : {
      return {
        ...state, 
        modalExport: true,
      };
    }
    case actionTypes.CLOSE_EXPORT_MODAL : {
      return {
        ...state, 
        modalExport: false,
      };
    }
    case actionTypes.OPEN_IMPORT_MODAL : {
      return {
        ...state, 
        modalImport: true,
      };
    }
    case actionTypes.CLOSE_IMPORT_MODAL : {
      return {
        ...state, 
        modalImport: false,
      };
    }
    default:
      return state;
  }
}
