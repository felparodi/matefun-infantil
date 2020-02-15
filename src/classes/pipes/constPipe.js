import { PIPE_TYPES, VALUES_TYPES, DIRECTION} from '../../constants/constants';
import { Pipe } from './pipe';

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
        default:
            return null;
    }
}

export class ConstPipe extends Pipe {

    constructor(value, type) {
        super([], [DIRECTION.BOTTOM]);
        this.setOutType(type);
        this.setValue(value)
    }

    setOutType(type) {
        this.outType = type ? type : null;
    }

    getOutType() {
        return this.outType;
    }

    setValue(value) {
        console.log('ConstPipe.setValue');
        const type = evalValueType(value);
        if(!this.getOutType()) {
            this.setOutType(type);
        } else if(this.getOutType() !== type) {
            throw new Error("Error de tipos") 
        }
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    toCode() {
        const type = this.getOutType();
        if(type === VALUES_TYPES.STRING) return `"${this.getValue()}"`;
        if(type === VALUES_TYPES.NUMBER) return `${this.getValue()}`;
        if(type === VALUES_TYPES.BOOLEAN) return `${this.getValue()}`;
        if(type === VALUES_TYPES.ARRAY) return `[${this.getValue()}]`;
        return `{${this.getValue()}}`;
    }

    getType() {
        return PIPE_TYPES.VALUE;
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            outType: this.getOutType(),
            value: this.getValue(),
        }
    }
}