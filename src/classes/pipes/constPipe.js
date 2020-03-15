import { PIPE_TYPES, VALUES_TYPES, DIRECTION} from '../../constants/constants';
import { processNext } from '../helpers/pipe';
import { validateDirType, matchTypes, evalValueType, valueToString } from '../helpers/type';
import { Pipe } from './pipe';

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
            if (!next.pipe || !next.connected) { this.addWarning('No esta conectado'); return;}
            
            if(next.inDir !== path) { next.pipe.calc(context, board, next.inDir); }

            const status = validateDirType(this, next);
            if (status.warning) this.addWarning(status.warning);
            if (status.error) this.addError(status.error);
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