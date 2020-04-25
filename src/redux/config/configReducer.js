import * as actionTypes from './configActionTypes';

const initialState = {
    openModal: false
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.OPEN_CONFIG_MODAL: {
      return {
        ...state, 
        openModal: true
      };
    }
    case actionTypes.CLOSE_CONFIG_MODAL : {
      return {
        ...state, 
        openModal: false
      };
    }
    default:
      return state;
  }
}
