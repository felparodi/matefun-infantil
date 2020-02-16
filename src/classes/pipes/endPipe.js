import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext, isMarked } from './pipe';

export class EndPipe extends Pipe {
    
    constructor() {
        super([DIRECTION.TOP], []);
    }

    calc(context, board) {
        if (!isMarked(context,this)) {
            super.calc(context, board);
            const next = processNext(this, board)(DIRECTION.TOP);
            if (next.pipe) {
                next.pipe.calc(context, board, DIRECTION.TOP);
                this.tempType = next.pipe.getOutType();
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

    snapshot() {
        return {
            ...(super.snapshot()),
            valueType: this.tempType,
        }
    }
}