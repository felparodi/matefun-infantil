import { IPipe, IPipeMonoType, IPipeMultiType } from '../type/IPipe';
import { PipeType, ValueType, Direction } from '../type/Enum'

export function matchTypes(type1: ValueType, type2: ValueType) {
    return !isDefined(type1) || !isDefined(type2) || type1 === type2;
}

export function isGeneric(type: ValueType) : boolean {
    return type === ValueType.Generic;
}

export function isDefined(type: ValueType) : boolean {
    return type !== ValueType.Undefined && !isGeneric(type);
}

export function pipeFuncDefined(pipe:IPipeMultiType) : boolean {
    for(let dir in Direction) {
        if (pipe.hasDirection(dir) 
            && !isDefined(pipe.getDirType(dir))) {
            return false;
        }
    }
    return true;
}

export function pipeNoFuncDefined(pipe: IPipeMonoType) {
    return isDefined(pipe.getValueType())
}

export function sortPipe(p1: IPipe, p2:IPipe) : -1 | 0 | 1 {
    const t1 = p1.getType();
    const t2 = p2.getType();
    if(t1 === t2 && t1 !== PipeType.Dummy && t1 !== PipeType.Variable) return 0;
    if(t1 === PipeType.Value) return -1;
    if(t2 === PipeType.Value) return 1;
    if(t1 === PipeType.Function && pipeFuncDefined(p1 as IPipeMultiType)) return -1;
    if(t2 === PipeType.Function && pipeFuncDefined(p2 as IPipeMultiType)) return 1;
    if(t1 === PipeType.Condition && pipeFuncDefined(p1 as IPipeMultiType)) return -1;
    if(t2 === PipeType.Condition && pipeFuncDefined(p2 as IPipeMultiType)) return 1;
    if(t1 === PipeType.End && pipeNoFuncDefined(p1 as IPipeMonoType)) return -1;
    if(t2 === PipeType.End && pipeNoFuncDefined(p2 as IPipeMonoType)) return 1;
    if(t1 === PipeType.Variable && pipeNoFuncDefined(p1 as IPipeMonoType)) return -1;
    if(t2 === PipeType.Variable && pipeNoFuncDefined(p1 as IPipeMonoType)) return 1;
    if(t1 === PipeType.Dummy && pipeNoFuncDefined(p1 as IPipeMonoType)) return -1;
    if(t2 === PipeType.Dummy && pipeNoFuncDefined(p2 as IPipeMonoType)) return 1;
    if(t1 === t2) return 0;
    if(t1 === PipeType.Function) return -1;
    if(t2 === PipeType.Function) return 1;
    if(t1 === PipeType.Condition) return -1;
    if(t2 === PipeType.Condition) return 1;
    if(t1 === PipeType.End) return -1;
    if(t2 === PipeType.End) return 1;
    if(t1 === PipeType.Variable) return -1;
    if(t2 === PipeType.Variable) return 1;
    if(t1 === PipeType.Dummy) return -1;
    return 1
}