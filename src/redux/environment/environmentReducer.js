import * as actionTypes from './environmentActionTypes';

export const initialState = {
    workspaceFileData: null,
    myFunctionsFileData: null
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
    default:
      return state;
  }
}
