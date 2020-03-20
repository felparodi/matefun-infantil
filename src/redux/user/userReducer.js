import * as actionTypes from './userActionTypes';

export const initialState = {
    userData: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN: {
      const userData = action.payload;
      return {
        ...state, 
        userData: userData
      };
    }
    case actionTypes.LOGOUT: {
      return {
        ...state,
        userData: null
      };
    }
    default:
      return state;
  }
}
