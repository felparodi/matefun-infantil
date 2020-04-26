import * as actionTypes from './configActionTypes';
import { COMPLEX } from '../../constants/toolbox';

const initialState = {
    openModal: false,
    complex: COMPLEX
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
    case actionTypes.SET_COMPLEX : {
      return {
        ...state, 
        complex: action.level
      };
    }
    default:
      return state;
  }
}
