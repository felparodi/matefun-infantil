import * as actionTypes from './actionTypes';

export const initialState = {
    auth: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN: {
      const userData = action.payload;
      return {
        ...state, 
        auth: userData
      };
    }
    case actionTypes.LOGOUT: {
      return {
        ...state,
        auth: null
      };
    }
    default:
      return state;
  }
}
