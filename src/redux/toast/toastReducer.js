import * as actionTypes from './toastActionType';

const initialState = {
    newToast: {}
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.NEW_TOAST_MESSAGE: {
      return {
        ...state, 
        newToast: { ...action.toast }
      };
    }
    default:
      return state;
  }
}