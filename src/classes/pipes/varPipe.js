import { PIPE_TYPES, DIRECTION, VALUES_TYPES  } from '../../constants/constants';
import { Pipe, processNext, isMarked, validateDirType, matchTypes, invertDirection } from './pipe';
import { evalValueType, valueToString } from './constPipe'
/*
*   Attr
*   - index: String
*/
export class VarPipe extends Pipe {

    constructor(type) {
        super([], [DIRECTION.BOTTOM]);
        this.type = type || VALUES_TYPES.UNDEFINED;
        this.value = undefined;
        this.clean();
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

    calc(context, board, path) {
        if (!isMarked(context, this)) {
            super.calc(context, board, path);
            this.index = this.index || context.index++;
            const inPipe = invertDirection(path);
            const next = processNext(this, board)(DIRECTION.BOTTOM)
            if (next.error) { this.addError(next.error); return }
            if (next.pipe) {
                if (next.dir !== inPipe) next.pipe.calc(context, board, next.dir);
                const status = validateDirType(this, next);
                if (status.error) { this.addError(status.error); return; }
                if (status.valid) { this.tempType = status.type; }
                if (status.warning) { this.addWarning(status.warning); }
                if (next.pipe.inProcess) {
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
        return this.tempType;
    }

    getValueType() {
        return this.getOutType();
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

    setDirType(direction, type) {
        if(direction === DIRECTION.BOTTOM) {
            this.tempType = type;
        }
    }


    getDirType(direction) {
        return direction === DIRECTION.BOTTOM ? this.getOutType() : null;
    }

    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM;
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