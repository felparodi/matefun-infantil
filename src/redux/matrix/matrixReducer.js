import * as actionTypes from './matrixActionTypes';
import { BOARD_ROWS, BOARD_COLS } from '../../constants/constants';

const initBoardGrid = new Array(BOARD_ROWS)
    .fill(null).map(() => new Array(BOARD_COLS));

export const initialState = {
    board: initBoardGrid,
    isEditMode: false,
    editFuncName: '',
    isFunction: false,
    canProcess: false,
    canSaveFunction: false,
    workspaceFunction: '',
    evalInstruction: '',
    resultEval: '',
    isWorking: false,
    isJoining: false,
    endJoin: null,
    startJoin: null,
    hasPending: !!localStorage.getItem('matrix')
};

export default function matrixReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_BOARD: {
      const { board, isFunction, canProcess, canSaveFunction } = action.payload;
      return {
        ...state, 
        board, isFunction, canProcess, canSaveFunction
      };
    }
    case actionTypes.SET_EVAL_INSTRUCTION: {
      const evalInstruction = action.payload;
      return {
        ...state,
        evalInstruction
      };
    }
    case actionTypes.SET_WORKSPACE_FUNCTION_BODY: {
      const workspaceInfo = action.payload;
      return {
        ...state,
        workspaceFunction: workspaceInfo.body
      };
    }
    case actionTypes.SET_RESULT_EVAL: {
      const message = action.payload;
      return {
        ...state,
        resultEval: message
      };
    }
    case actionTypes.SET_START_JOIN: {
      const startJoin = action.payload;
      return {
        ...state,
        startJoin
      };
    }
    case actionTypes.SET_END_JOIN: {
      const endJoin = action.payload;
      return {
        ...state,
        endJoin
      };
    }
    case actionTypes.CLEAN_JOIN: {
      return {
        ...state,
        startJoin: null,
        endJoin: null
      };
    }
    case actionTypes.SET_EDIT_MODE: {
      const { value, name } = action.payload
      return {
        ...state,
        isEditMode: value,
        editFuncName: name
      };
    }
    default:
      return state;
  }
}
