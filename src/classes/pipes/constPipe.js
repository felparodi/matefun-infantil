import { PIPE_TYPES, VALUES_TYPES, DIRECTION} from '../../constants/constants';
import { nextPipeDirection, validateDirType } from '../helpers/pipe';
import { matchTypes, evalValueType, valueToString } from '../helpers/type';
import { Pipe } from './pipe';

/*
*   @desc: Pipe que represtenta un valor fijo en la funcion
*   @attr private Value value: Donde esta el valor que contiene la constante
*   @attr private ValueType outType: Donde se indica el tipo de salida de la constante
*   @scope: public
*/
export class ConstPipe extends Pipe {

    /*
    *   @desc: Cosntucor, que dado un valor y/o un typo cosntrulle la ConstPipe
    *   @attr Value value: Valor inicial de la constante
    *   @attr ValueType type: Typo de valor de constante
    */
    constructor(value, type) {
        super([], [DIRECTION.BOTTOM]);
        this.setValueType(type);
        this.setValue(value)
        this.clean();
    }

    /*
    *   @desc: Caclua los errores y warnig de la ConstPipe y de sus conexiones
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
    *   @desc: Setea el ValueType que contine la constante
    *   @attr ValueType type: ValueType que se quiere asignar
    *   @return: void
    *   @scope: private
    */
    setValueType(type) {
        this.outType = type ? type : VALUES_TYPES.UNDEFINED;
    }

    /*
    *   @desc: Devuelve el ValueType que representa la ConstPipe
    *   @return: ValueType
    *   @scope: public
    */
    getValueType() {
        return this.outType;
    }

    /*
    *   @desc: Setea un nuevo valor en la constante si este es valido
    *   @attr Value value: valor que se desa setear
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
    *   @desc: Devulve el valor que esta contenido en la ConstPipe
    *   @return: Value
    *   @socpe: public
    */
    getValue() {
        return this.value;
    }

    /*
    *   @desc: Devulve el como se represta el valor en codigo
    *   @return: String
    *   @scope: public
    *   @overide
    */
    toCode() {
        return valueToString(this.getValue(), this.getValueType());
    }

    /*
    *   @desc: Devuelv el PipeType que repesenta a la ConstPipe
    *   @return: PipeValue
    *   @scope: public
    *   @overide
    */
    getType() {
        return PIPE_TYPES.VALUE;
    }

    /*
    *   @desc: Devuelve si es una direcion de salida valida
    *   @attr Direction dir:
    *   @return: Boolean
    *   @scope: public
    *   @overide
    */
    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM;
    }

    /*
    *   @desc: Devulve el SnapPipe que represta a esta ConstPipe
    *   @return: SnapPipe
    *   @scope: public
    */
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