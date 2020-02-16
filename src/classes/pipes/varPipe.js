import { PIPE_TYPES, DIRECTION, VALUES_TYPES  } from '../../constants/constants';
import { Pipe, processNext, isMarked, validateOutType, matchTypes } from './pipe';
import { evalValueType, valueToString } from './constPipe'
/*
*   Attr
*   - index: String
*/
export class VarPipe extends Pipe {

    constructor(type) {
        super([], [DIRECTION.BOTTOM]);
        this.type = type || VALUES_TYPES.UNDEFINED;
        this.index = undefined;
        this.value = undefined;
    }

    setValue(value) {
        const type = evalValueType(value);
        if(!matchTypes(this.getOutType(), type)) {
            throw new Error('No se puede asiganar el valor ya que es de otro tipo')
        }
        this.value = value;
        this.type = type;
    }

    getValue() {
        return this.value;
    }

    clean() {
        super.clean();
        this.index = undefined
        this.tempType = this.type;
    }

    calc(context, board) {
        if (!isMarked(context, this)) {
            super.calc(context);
            this.index = this.index || context.index++;
            const next = processNext(this, board)(DIRECTION.BOTTOM)
            if (next.pipe) {
                if (!next.pipe.inProcess) {
                    next.pipe.calc(context, board, DIRECTION.BOTTOM);
                    const status = validateOutType(this.type, next);
                    this.tempType = status.type || this.type;
                    if (status.warning) this.addWarning(status.warning);
                    if (status.error) this.addError(status.error);
                } else {
                   context.marks[this.getPosX()][this.getPosY()] = false; 
                }
            } else {
                this.addWarning('No esta conectado a nada ')
            }
        }
    }

    setIndex(index) {
        this.index = index;
    }

    getIndex(index) {
        return this.index;
    }

    getOutType() {
        return this.value ? this.type : this.tempType;
    }

    getName() {
        return `x${this.index}`
    }

    toCode(direction, blockVar) {
        return `${this.getName()}`;
    }

    getType() {
        return PIPE_TYPES.VARIABLE;
    }

    snapshot() {
        const value = this.getValue();
        const outType = this.getOutType();
        return {
            ...(super.snapshot()),
            index: this.index,
            name: this.getName(),
            outType,  
            value,
            valueText: valueToString(value, outType)
        }
    }
}