import { Direction, ValueType, PipeType} from './Enum';

export interface IPipe {
    getType: () => PipeType; 
    getPos: () => [ number, number ];
    hasDirection: (Direction) => boolean;
    isOutDir: (Direction) => boolean;
    isInDir: (Direction) => boolean;
}

export interface IPipeMultiType extends IPipe {
    getDirValueType: (Direction) => ValueType;
    setDirValueType: (Direction, ValueType) => void;
}

export interface IPipeMonoType extends IPipe {
    getValueType: () => ValueType;
    setValueType: (ValueType) => void;
}