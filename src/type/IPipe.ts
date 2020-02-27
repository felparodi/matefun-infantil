import { Direction, ValueType, PipeType} from './Enum';

export interface IPipe {
    getType: () => PipeType; 
    getPos: () => [ number, number ];
    hasDirection: (Direction) => boolean;
}

export interface IPipeMultiType extends IPipe {
    getDirType: (Direction) => ValueType;
}

export interface IPipeMonoType extends IPipe {
    getValueType: () => ValueType;
}