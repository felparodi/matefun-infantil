import { PIPE_TYPES, VALUES_TYPES, DIRECTION} from '../../constants/constants';
import { nextPipeDirection, validateDirType } from '../helpers/pipe';
import { matchTypes, evalValueType, valueToString } from '../helpers/type';
import { Pipe } from './pipe';

/*
*   @desc: Pipe que represtenta un valor fijo en la funcion
*   @scope: public
*/
export class ConstPipe extends Pipe {

    /*
    *   @desc:  
    *   @attr Value value?:
    *   @attr ValueType type?:
    */
    constructor(value, type) {
        super([], [DIRECTION.BOTTOM]);
        this.setValueType(type);
        this.setValue(value)
        this.clean();
    }

     /*
    *   @desc:
    *   @attr Context context: Context que marca los Pipe que ya se procesaron para que no se generen loops
    *   @attr IMarix board: IMatrix en la que se calcula todo
    *   @attr Direction enterDir?: Direcion desde donde se caclua en caso de ser recuiciba
    *   @attr Array<Pipe> path?: Camino de la recurcion en el calculo
    *   @return: void
    *   @scope: public
    *   @overider
    */
    calc(context, board, enterDir, path) {
        if(!context.isMark(this.getPos())) {
            context.mark(this.getPos());
            const next = nextPipeDirection(this, DIRECTION.BOTTOM);
            if (next.error) { this.addError(next.error); return }
            if (!next.pipe || !next.connected) { this.addWarning('No esta conectado'); return;}
            const newPath = enterDir ? [...path, this] : [this];
            if(next.dir !== enterDir) { next.pipe.calc(context, board, next.inDir, newPath); }
            const status = validateDirType(this, next);
            if (status.warning) this.addWarning(status.warning);
            if (status.error) this.addError(status.error);
        }
    }

    /*
    *   @desc:
    *   @attr ValueType type: ValueType que se quiere asignar
    *   @return: void
    *   @scope: private
    */
    setValueType(type) {
        this.outType = type ? type : VALUES_TYPES.UNDEFINED;
    }

    /*
    *   @desc:
    *   @return: ValueType
    *   @scope: public
    */
    getValueType() {
        return this.outType;
    }

    /*
    *   @desc:
    *   @attr Value value:
    *   @return: void
    *   @scope: public
    */
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

    /*
    *   @desc:
    *   @return: Value
    *   @socpe: public
    */
    getValue() {
        return this.value;
    }

    /*
    *   
    */
    toCode() {
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
                bottom: this.getValueType(),
            },
            value: this.getValue(),
            valueText: this.toCode(),
        }
    }
}