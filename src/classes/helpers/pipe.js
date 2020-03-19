import { DIRECTION, PIPE_TYPES } from '../../constants/constants';
import { invertDirection, directionMove } from './direction';
import { matchTypes, typeCompare, isDefined} from './type'

export function pipeDirValueType(pipe, dir) {
    if (pipe.hasDirection(dir)) {
        if (pipe.getValueType) return pipe.getValueType();
        if (pipe.getDirValueType) return pipe.getDirValueType(dir);
    }
}

function pipeMultiTypeDefined(pipe) {
    for(let dir in DIRECTION) {
        if (pipe.hasDirection(dir) 
            && !isDefined(pipe.getDirValueType(dir))) {
            return false;
        }
    }
    return true;
}

function pipeMonoTypeDefined(pipe) {
    return isDefined(pipe.getValueType());
}

export function pipeTypeDefined(pipe) {
    if (pipe.getValueType) return pipeMonoTypeDefined(pipe);
    if (pipe.getDirValueType) return pipeMultiTypeDefined(pipe);
    return false;
}

export function validateDirType(pipe, next) {
    const nextInvDir = invertDirection(next.dir);
    const nextType = pipeDirValueType(next.pipe, nextInvDir);
    if (nextType) {
        const pipeDirType = pipeDirValueType(pipe, next.dir);
        if (!matchTypes(pipeDirType, nextType)) {
            return { valid: false, error: 'Tipos no conciden' }
        } 
        return { valid: true, type:typeCompare(pipeDirType, nextType) }
    } 
    return { valid: false, warning: 'Connecion Obstuida' }
}

export function matchPipeTypeDir(p1, dir1, p2, dir2) {
    const typeDir1 = p1.getDirValueType ? p1.getDirValueType(dir1) : p1.getValueType();
    const typeDir2 = p2.getDirValueType ? p2.getDirValueType(dir2) : p2.getValueType();
    return matchTypes(typeDir1, typeDir2);
}

/*
*   @desc: Funcion que sirve para compara la prioridad para ordenar 2 IPipe
*   @attr IPipe p1: Una de las IPipe que se desea ordenar
*   @attr IPipe p2: Una de las IPipe que se desea ordenar
*   @return: Int
*   @scope: public
*/
export function sortPipe(p1, p2) {
    if(p1 && p2) {
        const t1 = p1.getType();
        const t2 = p2.getType();
        if(t1 === t2 && pipeTypeDefined(p1) && pipeTypeDefined(p2)) return 0;
        if(t1 === PIPE_TYPES.VALUE && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.VALUE && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.CONDITION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.CONDITION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.DUMMY && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.DUMMY && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p2)) return 1;
        if(t1 === t2) return 0;
        if(t1 === PIPE_TYPES.VALUE) return -1;
        if(t2 === PIPE_TYPES.VALUE) return 1;
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

//TODO ver como se conporat con el getAraoundPipe del Matrix
export function processNext(pipe) {
    return (direction) => {
        let next, dir, inDir, connected, children, error;
        dir = direction;
        inDir = invertDirection(direction);
        try {
            const {x, y} = directionMove(pipe.getPos(), direction);
            const board = pipe.getBoard();
            if (!board) { return null; }
            next = pipe.board.value(x, y);
            connected = next ?  next.hasDirection(inDir) : true;
            children = next ?  next.isOutDir(inDir) : true;
        } catch(e) {
            error = e.message;
        }
        return { pipe: next, dir, inDir, connected, children, error };
    }
}

//Retorna los siguintes padres directos que no sean dummys
export function getNextParents(pipe) {
    const parents = pipe.getOutDirections()
        .map(processNext(pipe))
        .filter(next => next.pipe)
        .map(next => next.pipe);;
    const dummys = parents
        .filter(pipe => pipe.getType() === PIPE_TYPES.DUMMY);
    const notDummys = parents
        .filter(pipe => pipe.getType() !== PIPE_TYPES.DUMMY)
  
    const dummyParent = dummys
        .map((pipe) => getNextParents(pipe))
        .reduce((acc, parent) => [...acc, ...parent] ,[]);
    return [...notDummys, ...dummyParent ];
}