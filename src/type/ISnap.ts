import { Value } from './Value';
import { ValueType, PipeType } from './Enum';

export interface IPipeSnap {
    type: PipeType;
    pos: IPos;
    dir: IDir;
    dirType: IDirType;
    name?: string;
    value?: Value;
    valueText?: string
}

export interface IPos {
    x: number;
    y: number;
}

export interface IDir {
    top?: boolean;
    left?: boolean;
    right?: boolean;
    bottom?: boolean;
}

export interface IDirType {
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
