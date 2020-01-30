import { PIPE_TYPES, VALUES_TYPES, DIRECTION} from '../../constants/constants';
import { TypePipe } from './typePipe';

export function evalValueType(value) {
    switch(typeof value) {
        case 'boolean': return VALUES_TYPES.BOOLEAN;
        case 'number': return VALUES_TYPES.NUMBER;
        case 'string': return VALUES_TYPES.STRING;
        case 'function': return VALUES_TYPES.FUNCTION;
        case 'object': {
            if (Array.isArray(value)) {
                return VALUES_TYPES.ARRAY;
            }
            return VALUES_TYPES.OTHER;
        }
    }
}

export class ConstPipe extends TypePipe {
    constructor(type, value) {
        super([], [DIRECTION.BOTTOM]);
        if(type !== undefined && type !== null) {
            this.setOutTypes([type])
        }
        this.setValue(value)
    }

    setValue(value) {
        const type = evalValueType(value);
        const thisTypes = this.getOutTypes();
        if(this.getOutTypes() === undefined 
            || this.getOutTypes() === null 
            || this.getOutTypes().length === 0) {
            this.setOutTypes([type]);
        } else if(this.getOutTypes()[0] !== type) {
            throw new Error("Error de tipos") 
        }
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getOutType(types) {
        return this.outTypes;
    }

    toCode(direction) {
        const thisOutType = this.getOutTypes();
        if(thisOutType.indexOf(VALUES_TYPES.STRING) === 0) return `"${this.getValue()}"`;
        if(thisOutType.indexOf(VALUES_TYPES.NUMBER) === 0) return `${this.getValue()}`;
        if(thisOutType.indexOf(VALUES_TYPES.BOOLEAN) === 0) return `${this.getValue()}`;
        if(thisOutType.indexOf(VALUES_TYPES.ARRAY) === 0) return `[${this.getValue()}]`;
        return `{${this.getValue()}}`;
    }

    getType() {
        return PIPE_TYPES.VALUE;
    }
}