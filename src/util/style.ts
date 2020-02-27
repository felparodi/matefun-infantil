import { ValueType } from '../type/Enum';

export function typeClass(type : ValueType): string {
    switch(type) {
        case ValueType.Number:
            return 'Number';
        default:
            return 'Undefined';
    }
}