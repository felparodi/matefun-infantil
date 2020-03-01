import { Value } from './Value';
import { ValueType, PipeType } from './Enum';

export interface IPipeSnap {
    type: PipeType;
    pos: IPos;
    dir: IDir;
    name?: string;
    value?: Value;
    valueMateFun?: IMateFunResp;
    valueText?: string;
    errors?: Array<string>;
    warnings?: Array<string>; 
}

export interface IMateFunResp {
    type: string;
    resultado: string;
}

export interface IPos {
    x: number;
    y: number;
}

export interface IDir {
    top?: ValueType;
    left?: ValueType;
    right?: ValueType;
    bottom?: ValueType;
}

export interface IMatrixSnap {
    board: Array<Array<IPipeSnap>>;
    isFunction: boolean;
    canProcess: boolean;
    cantFuncEval: boolean;
}
