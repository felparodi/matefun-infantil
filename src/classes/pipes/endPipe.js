import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext, isMarked, invertDirection, validateDirType } from './pipe';

export class EndPipe extends Pipe {
    
    constructor() {
        super([DIRECTION.TOP], []);
        this.value = undefined;
    }

    calc(context, board, path) {
        if (!isMarked(context,this)) {
            super.calc(context, board);
            const inPath = invertDirection(path);
            const next = processNext(this, board)(DIRECTION.TOP);
            const nextInvDir = invertDirection(next.dir);
            if (next.error) { this.addError(next.error); return }
            if (next.pipe) {
                if(next.dir !== inPath) next.pipe.calc(context, board, next.dir);
                const status = validateDirType(this, next);
                if(status.warning) { this.addWarning(status.warning); }
                if(status.error) { this.addError(status.error); }
                if(status.valid) {
                    this.tempType = status.type;
                }
                if (next.pipe.inProcess) {
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

    isInDir(dir) {
        return dir.TOP === dir;
    }

    setDirType(direction, type) {
        if(direction === DIRECTION.TOP) {
            this.tempType = type;
        }
    }

    getDirType(direction) {
        return direction === DIRECTION.TOP ? this.tempType : null;
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            valueType: this.tempType,
            value: this.value
        }
    }
}