import { PIPE_TYPES, VALUES_TYPES, DIRECTION} from '../../constants/constants';
import { Pipe, isMarked, processNext, validateDirType, invertDirection, matchTypes } from './pipe';

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

export class ConstPipe extends Pipe {

    constructor(value, type) {
        super([], [DIRECTION.BOTTOM]);
        this.setValueType(type);
        this.setValue(value)
    }

    calc(context, board, path) {
        if(!context.isMark(this.getPos())) {
            context.mark(this.getPos());
            const next = processNext(this, board)(DIRECTION.BOTTOM);
            if (next.error) { this.addError(next.error); return }
            if (next.pipe) {
                if(next.inDir !== path) { 
                    next.pipe.calc(context, board, next.inDir);
                }

                const status = validateDirType(this, next);
                if (status.warning) this.addWarning(status.warning);
                if (status.error) this.addError(status.error);
            } else {
                this.addWarning('No esta conectado');
            }
        }
    }

    setValueType(type) {
        this.outType = type ? type : VALUES_TYPES.UNDEFINED;
    }

    getValueType() {
        return this.outType;
    }

    setValue(value) {
        const type = evalValueType(value);
        const myType = this.getValueType();
        if(!matchTypes(myType, type)) {
            throw new Error('No se puede asiganar el valor ya que es de otro tipo')
        }
        //Ver aca sis se puede mejorar
        if(type !== VALUES_TYPES.UNDEFINED) {
            this.outType = type;
        }
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    toCode(dir, board) {
        return valueToString(this.getValue(), this.getValueType());
    }

    getType() {
        return PIPE_TYPES.VALUE;
    }

    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM;
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            dir: {
                bottom: this.getValueType()
            },
            value: this.getValue(),
            valueText: this.toCode(),
        }
    }
}