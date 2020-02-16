import { PIPE_TYPES, DIRECTION, VALUES_TYPES  } from '../../constants/constants';
import { Pipe, processNext, isMarked, validateOutType } from './pipe';

/*
*   Attr
*   - index: String
*/
export class VarPipe extends Pipe {

    constructor(type) {
        super([], [DIRECTION.BOTTOM]);
        this.type = type || VALUES_TYPES.UNDEFINED;
        this.index = undefined;
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
        return this.tempType;;
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
        return {
            ...(super.snapshot()),
            name: this.getName(),
            outType: this.getOutType(),  
        }
    }
}