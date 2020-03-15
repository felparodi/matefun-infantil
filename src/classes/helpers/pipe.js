import { DIRECTION, PIPE_TYPES } from '../../constants/constants';
import { invertDirection, directionMove } from '../helpers/direction';
import { pipeTypeDefined } from '../helpers/type';

export function sortPipe(p1, p2) {
    if(p1 && p2) {
        const t1 = p1.getType();
        const t2 = p2.getType();
        if(t1 === t2 && t1 !== PIPE_TYPES.DUMMY && t1 !== PIPE_TYPES.VARIABLE) return 0;
        if(t1 === PIPE_TYPES.VALUE) return -1;
        if(t2 === PIPE_TYPES.VALUE) return 1;
        if(t1 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.CONDITION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.CONDITION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.DUMMY && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.DUMMY && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p2)) return 1;
        if(t1 === t2) return 0;
        if(t1 === PIPE_TYPES.FUNCTION) return -1;
        if(t2 === PIPE_TYPES.FUNCTION) return 1;
        if(t1 === PIPE_TYPES.CONDITION) return -1;
        if(t2 === PIPE_TYPES.CONDITION) return 1;
        if(t1 === PIPE_TYPES.VARIABLE) return -1;
        if(t2 === PIPE_TYPES.VARIABLE) return 1;
        if(t1 === PIPE_TYPES.END) return -1;
        if(t2 === PIPE_TYPES.END) return 1;
        if(t1 === PIPE_TYPES.DUMMY) return -1;
        return 1
    } else if (!p1) {
        return 1;
    } else if (!p2) {
        return -1;
    }
    return 0
}

export function processNext(pipe) {
    return (direction) => {
        let next, dir, inDir, connected, children, error;
        dir = direction;
        inDir = invertDirection(direction);
        try {
            const {x, y} = directionMove(pipe.getPos(), direction);
            if (!pipe.board) { return null; }
            next = pipe.board.value(x, y);
            connected = next ?  next.hasDirection(inDir) : true;
            children = next ?  next.isOutDir(inDir) : true;
        } catch(e) {
            error = e.message;
        }
        return { pipe: next, dir, inDir, connected, children, error };
    }
}