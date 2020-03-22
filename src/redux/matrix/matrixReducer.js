import * as actionTypes from './matrixActionTypes';
import { BOARD_ROWS, BOARD_COLS } from '../../constants/constants';

const initBoardGrid = new Array(BOARD_ROWS)
    .fill(null).map(() => new Array(BOARD_COLS));

export const initialState = {
    board: initBoardGrid,
    isFunction: false,
    canProcess: false,
    workspaceFunction: '',
    evalInstruction: '',
    isWorking: false,
    hasPending: !!localStorage.getItem('matrix')
};

export default function matrixReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_BOARD: {
      const boardSnap = action.payload;
      return {
        ...state, 
        board: boardSnap.board, 
        isFunction: boardSnap.isFunction,
        canProcess: boardSnap.canProcess,
        isWorking: boardSnap.isWorking,
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
    default:
      return state;
  }
}
