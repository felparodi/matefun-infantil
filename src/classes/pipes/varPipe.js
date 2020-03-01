import { PIPE_TYPES, DIRECTION, VALUES_TYPES  } from '../../constants/constants';
import { Pipe, processNext, validateDirType, matchTypes, pipeTypeDefined } from './pipe';
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
        if(!matchTypes(this.getValueType(), type)) {
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
        if (!context.isMark(this.getPos())) {
            context.mark(this.getPos());

            this.index = this.index || context.getIndex();

            const next = processNext(this, board)(DIRECTION.BOTTOM)
            if (next.error) { this.addError(next.error); return; }
            if (!next.pipe || !next.connected) {this.addWarning('No esta conectado a nada '); return;}

            if (next.dir !== path) { next.pipe.calc(context, board, next.inDir); }

            const status = validateDirType(this, next);
            if (status.error) { this.addError(status.error); return; }
            if (status.warning) { this.addWarning(status.warning); }
            if (status.valid) { this.tempType = status.type; }
        
            if(!this.errors && !pipeTypeDefined(this)) {
                context.unMark(this.getPos());å
            }
        }
    }

    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM
    }

    getValueType() {
        return this.tempType;
    }

    setValueType(direction, type) {
        this.type = type;
    }

    getName() {
        return `x${this.index}`
    }

    toCode(direction, blockVar) {
        return `${this.getName()}`;
    }

    getValueEval() {
       return valueToString(this.getValue(), this.getValueType());
    }

    getType() {
        return PIPE_TYPES.VARIABLE;
    }

    snapshot() {
        const value = this.getValue();
        return {
            ...(super.snapshot()),
            name: this.getName(),
            dir: {
                bottom: this.getValueType(),
            },
            value,
            valueText: valueToString(value, this.getValueType())
        }
    }
}