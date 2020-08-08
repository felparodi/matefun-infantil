import { DIRECTION, PIPE_TYPES } from '../../constants/constants';
import { invertDirection, directionMove } from './direction';
import { matchTypes, typeCompare, isDefined} from './type'

/*
*   @desc: Devuelve el typo de una direcion de un IPipe
*   @attr IPipe pipe: Pipe de la que se quiere saber el tipo de una direccion
*   @attr Direction dir: Direcion de la que se quiere saber el tipo
*   @return: ?ValueType
*   @scope: public
*   @TODO ver si se puede usar solo una funcion para los que se tinee solo valueType asi no tener que llamar a tantas funciones
*/
export function pipeDirValueType(pipe, dir) {
    if (pipe.hasDirection(dir)) {
        if (pipe.getValueType) return pipe.getValueType();
        if (pipe.getDirValueType) return pipe.getDirValueType(dir);
    }
    return undefined;
}

/*
*   @desc: Devuelve si un Pipe con muchas direciones tiene todas sus direciones con tipos definidos
*   @attr IPipe pipe: Pipe de la que se quiere saber si todas su direciones estan definidas
*   @retrun: Boolean
*   @scope: private
*   @TODO same pipeDirValueType
*/
function pipeMultiTypeDefined(pipe) {
    for(let dir in DIRECTION) {
        if (pipe.hasDirection(dir) 
            && !isDefined(pipe.getDirValueType(dir))) {
            return false;
        }
    }
    return true;
}

/*
*   @desc: Devuelve si ValueType de una IPipe que solo tiene un ValueType posibles en sus direciones esta definido
*   @attr IPipe pipe: Pipe que se desa saber el valor
*   @return: Boolean 
*   @scope: private
*   @TODO same pipeDirValueType
*/
function pipeMonoTypeDefined(pipe) {
    return isDefined(pipe.getValueType());
}

/*
*   @desc: Devulve si un IPipe tiene todas los ValueType definidos
*   @attr IPipe pipe: IPipe que se desa evaluar
*   @return: Boolean
*   @scope: public
*   @TODO same pipeDirValueType
*/
export function pipeTypeDefined(pipe) {
    if (pipe.getValueType) return pipeMonoTypeDefined(pipe);
    if (pipe.getDirValueType) return pipeMultiTypeDefined(pipe);
    return false;
}

/*
*   @desc: Debuvle si un IPipe y sus NextPipe tiene los tipos de la direcciones que coninciden validos,
*   @attr IPipe pipe: IPipe que se quiere evaluar
*   @attr NextPipe next: NextPipe contra la que se valida
*   @return: TypeEvaluation
*   @scope: public
*/
export function validateDirType(pipe, next) {
    const nextInvDir = invertDirection(next.dir);
    const nextType = pipeDirValueType(next.pipe, nextInvDir);
    if (nextType) {
        const pipeDirType = pipeDirValueType(pipe, next.dir);
        if (!matchTypes(pipeDirType, nextType)) {
            return { valid: false, error: 'Tipos no conciden' }
        } 
        return { valid: true, type: typeCompare(pipeDirType, nextType) }
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
        if(t1 === PIPE_TYPES.CONST && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.CONST && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.CONDITION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.CONDITION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.DUMMY && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.DUMMY && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p2)) return 1;
        if(t1 === t2) return 0;
        if(t1 === PIPE_TYPES.CONST) return -1;
        if(t2 === PIPE_TYPES.CONST) return 1;
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

/*
*   @desc: Devuelve el NextPipe para una IPipe su corresponditente direccion
*   @attr IPipe pipe: IPipe que se evalua
*   @attr Direction direction: Direction de la IPipe que se quiere saber su siguiente
*   @retrun: NextPipe
*   @scope: public
*/
export function nextPipeDirection(pipe, direction) {
    let next, dir, inDir, connected, children, error;
    dir = direction;
    inDir = invertDirection(direction);
    try {
        const {x, y} = directionMove(pipe.getPos(), direction);
        const board = pipe.getBoard();
        if (!board) { return null; }
        next = board.value(x, y);
        connected = next ?  next.hasDirection(inDir) : true;
        children = next ?  next.isOutDir(inDir) : true;
    } catch(e) {
        error = e.message;
    }
    return { pipe: next, dir, inDir, connected, children, error };
}

/*
*   @desc: Devuelve una funcion que dada un direcion te debuelve la NextPipe para la IPipe que se creo
*   @attr IPipe pipe: IPipe que se bindea a la funcion
*   @return: (Direction) => NextPipe
*   @scope: public
*/
export function processNext(pipe) {
    return (direction) => nextPipeDirection(pipe, direction);
}

/*
*   @desc: Retorna los siguintes padres que no sean dummys,
*        en caso de tener algune que sea dummy se le dara el padre del mismo
*   @attr IPipe pipe:
*   @return Array<IPipe>
*   @scope: public
*/
export function getParentsPipeNotDummy(pipe) {
    const parents = pipe.getOutDirections()
        .map(processNext(pipe))
        .filter(next => next.pipe)
        .map(next => next.pipe);
    const dummys = parents
        .filter(pipe => pipe.getType() === PIPE_TYPES.DUMMY);
    const notDummys = parents
        .filter(pipe => pipe.getType() !== PIPE_TYPES.DUMMY);
    const dummyParent = dummys
        .map((pipe) => getParentsPipeNotDummy(pipe))
        .reduce((acc, parent) => [...acc, ...parent] ,[]);
    return [...notDummys, ...dummyParent ];
}

/*
*   @desc: Retorna la lista de los NextPipe de los hijos directos
*   @attr IPipe pipe: IPipe que se queiren obtener sus hijos
*   @return Array<NextPipe>
*   @scope: public
*/
export function getNextChildren(pipe) {
    return pipe.getInDirections().map(processNext(pipe))
}

/*
*   @desc: Retorna la lista de los NextPipe de todas las direcciones de un IPipe
*   @attr IPipe pipe:
*   @return Array<NextPipe>
*   @scope: public
*/
export function getAllNextPipe(pipe) {
    return pipe.getAllDirection().map(processNext(pipe))
}
