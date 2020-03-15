import { VALUES_TYPES, MATEFUN_TYPE, DIRECTION } from '../../constants/constants'
import { invertDirection } from './direction';

export function getMateFunType(varPipe) {
    const type = varPipe.getValueType();
    switch (type) {
        case VALUES_TYPES.NUMBER:
            return MATEFUN_TYPE.NUMBER;
        case VALUES_TYPES.FIGURE:
            return MATEFUN_TYPE.FIGURE;
        case VALUES_TYPES.POINT:
            return MATEFUN_TYPE.POINT;
        case VALUES_TYPES.COLOR:
            return MATEFUN_TYPE.COLOR;
        default:
            return "?";
    }
}

export function matchTypes(type1, type2) {
    return !isDefined(type1) || !isDefined(type2) || type1 === type2;
}

export function isGeneric(type) {
    const { GENERIC, GENERIC2, GENERIC3} = VALUES_TYPES;
    return type === GENERIC || type === GENERIC2 || type === GENERIC3;
}

export function isDefined(type) {
    const { UNDEFINED } = VALUES_TYPES;
    return type !== UNDEFINED && !isGeneric(type);
}

export function pipeMultiTypeDefined(pipe) {
    for(let dir in DIRECTION) {
        if (pipe.hasDirection(dir) 
            && !isDefined(pipe.getDirValueType(dir))) {
            return false;
        }
    }
    return true;
}

export function pipeMonoTypeDefined(pipe) {
    return isDefined(pipe.getValueType());
}

export function pipeTypeDefined(pipe) {
    if (pipe.getValueType) return pipeMonoTypeDefined(pipe);
    if (pipe.getDirValueType) return pipeMultiTypeDefined(pipe);
    return false;
}

export function typeCompare(t1, t2) {
    if(isDefined(t1)) { return t1; }
    if(isDefined(t2)) { return t2; }
    if(isGeneric(t1)) { return t1; }
    if(isGeneric(t2)) { return t2; }
    return VALUES_TYPES.UNDEFINED;
}

export function pipeDirValueType(pipe, dir) {
    if (pipe.hasDirection(dir)) {
        if (pipe.getValueType) return pipe.getValueType();
        if (pipe.getDirValueType) return pipe.getDirValueType(dir);
    }
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

export function evalValueType(value) {
    switch(typeof value) {
        case 'boolean': return VALUES_TYPES.BOOLEAN;
        case 'number': return VALUES_TYPES.NUMBER;
        case 'string': return VALUES_TYPES.STRING;
        case 'function': return VALUES_TYPES.FUNCTION;
        case 'object': {
            if(value === null) return VALUES_TYPES.UNDEFINED;
            if(value.x !== undefined && value.y !== undefined)  return VALUES_TYPES.POINT;
            if(value.color) return VALUES_TYPES.COLOR;
            if (Array.isArray(value)) {
                //TODO array of number
                return VALUES_TYPES.ARRAY;
            }
            return VALUES_TYPES.OTHER;
        }
        default:
            return VALUES_TYPES.UNDEFINED;
    }
}

export const valueToString = (value, type) => {
    if(value === null || value == undefined) return '?';
    if(type === VALUES_TYPES.STRING) return `"${value}"`;
    if(type === VALUES_TYPES.NUMBER) return `${value}`;
    if(type === VALUES_TYPES.BOOLEAN) return `${value}`;
    if(type === VALUES_TYPES.COLOR) return `${value.color}`;
    if(type === VALUES_TYPES.POINT) return `(${value.x}, ${value.y})`;
    return `${JSON.stringify(value)}`;
}

export function matchPipeTypeDir(p1, dir1, p2, dir2) {
    const typeDir1 = p1.getDirValueType ? p1.getDirValueType(dir1) : p1.getValueType();
    const typeDir2 = p2.getDirValueType ? p2.getDirValueType(dir2) : p2.getValueType();
    return matchTypes(typeDir1, typeDir2);
}
