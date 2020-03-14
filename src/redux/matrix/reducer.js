import * as actionTypes from './actionTypes';
import { BOARD_ROWS, BOARD_COLS } from '../../constants/constants';

const initBoardGrid = new Array(BOARD_ROWS)
    .fill(null).map(() => new Array(BOARD_COLS));

export const initialState = {
    board: initBoardGrid,
    isFunction: false,
    canProcess: false,
    workspaceFunction: '',
    evalInstruction: '',
};

export default function matrix(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_BOARD: {
      const boardSanp = action.payload;
      return {
        ...state, 
        board: boardSanp.board, 
        isFunction: boardSanp.isFunction,
        canProcess: boardSanp.canProcess
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
