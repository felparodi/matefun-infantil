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
    resultEval: '',
    isWorking: false,
    isJoining: false,
    hasPendding: !!localStorage.getItem('matrix')
};

export default function matrix(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_BOARD: {
      const boardSanp = action.payload;
      return {
        ...state, 
        board: boardSanp.board, 
        isFunction: boardSanp.isFunction,
        canProcess: boardSanp.canProcess,
        isWorking: boardSanp.isWorking,
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
      const messsage = action.payload;
      return {
        ...state,
        resultEval: messsage
      }
    }
    default:
      return state;
  }
}
