import { MatrixPipe } from '../classes/matrix';
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants';

let matrix = new MatrixPipe(BOARD_ROWS, BOARD_COLS);

export function removePipe(pipe) {
    if (pipe.pos) {
        matrix.removePipe(pipe.pos.x, pipe.pos.y);
    }
} 

export function moverPipe(row, col, pipeSnap) {
    matrix.moverPipe(row, col, pipeSnap.pos);
}

export function addPipeSnap(row, col, pipeSnap) {
    matrix.addPipeSnap(row, col, pipeSnap);
}

export function setPipeValue(x, y, value) {
    matrix.setPipeValue(x, y, value);
}

export function process() {
    return matrix.process();
}

export function evaluate() {
    return matrix.evaluateFunction();
}

export function setMateFunValue(message) {
    matrix.setMateFunValue(message);
}

export function getSnapshot() {
    return matrix.snapshot();
}