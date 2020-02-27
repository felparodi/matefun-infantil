import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext, isMarked, invertDirection, validateDirType, pipeTypeDefined } from './pipe';

export class EndPipe extends Pipe {
    
    constructor(type) {
        super([DIRECTION.TOP], []);
        this.type = type || VALUES_TYPES.UNDEFINED;
        this.value = undefined;
        this.clean();
    }

    calc(context, board, path) {
        if (!context.isMark(this.getPos())) {
            super.calc(context, board);
            const next = processNext(this, board)(DIRECTION.TOP);
            if (next.error) { this.addError(next.error); return }
            if (!next.pipe || !next.connected) { this.addWarning("No esta conectado a nada"); return; }
            
            if(next.dir !== path) next.pipe.calc(context, board, next.inDir);

            const type = pipeDirValueType(next.pipe, next.inDir);
            if (matchTypes(this.tempType, type)) {
                this.tempType = typeCompare(this.tempType, type);
            } else { 
                this.addError('No machean tipos');
                return;
            }
        }
    }

    clean() {
        super.clean();
        this.tempType = this.type;
    }

    toCode(dir, board) {
        const arg = this.toCodeArg(DIRECTION.TOP, board);
        return `${arg[0]}`;
    }

    getType() {
        return PIPE_TYPES.END;
    }

    isInDir(dir) {
        return DIRECTION.TOP === dir;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    getValueType() {
        return this.tempType;
    }

    setValueType(type) {
        this.type = type;
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            dir: {
                top: this.getValueType()
            },
            value: this.getValue()
        }
    }
}