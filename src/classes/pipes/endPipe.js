import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext, isMarked, invertDirection } from './pipe';

export class EndPipe extends Pipe {
    
    constructor() {
        super([DIRECTION.TOP], []);
        this.value = undefined;
    }

    calc(context, board, path) {
        if (!isMarked(context,this)) {
            super.calc(context, board);
            const next = processNext(this, board)(DIRECTION.TOP);
            if (next.pipe) {
                if (!next.pipe.inProcess) {
                    next.pipe.calc(context, board, DIRECTION.TOP);
                    this.tempType = next.pipe.getOutType();
                } else {
                    context.marks[this.getPosX()][this.getPosY()] = false; 
                }
            } else {
                this.addWarning('No esta conectado a nada')
            }
        }
    }

    clean() {
        super.clean();
        this.tempType = VALUES_TYPES.UNDEFINED;
    }

    toCode(dir, board) {
        const arg = this.toCodeArg(DIRECTION.TOP, board);
        return `${arg}`;
    }

    isDirectionDefined() {
        return true;
    }

    getType() {
        return PIPE_TYPES.END;
    }

    getInType() {
        return this.tempType;
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            valueType: this.tempType,
            value: this.value
        }
    }
}