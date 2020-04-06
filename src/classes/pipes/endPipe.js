import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { matchTypes, typeCompare} from '../helpers/type';
import { nextPipeDirection, pipeDirValueType } from '../helpers/pipe';
import { Pipe } from './pipe';

/*
*   @desc: Esta Pipe represtan la salida de la funcion,
*    es la raiz del arbol que representa la construcion de la misma
*   @attr private EndValue value: Valor que se tiene de una salida del matefun
*   @attr private ValueType type: Typo de el valor que se quiere ayar
*   @attr private ValueType tempType: Typo que se cacula en calc
*/
export class EndPipe extends Pipe {

    /*
    *   @desc: Constructor donde se puede setar el tipo de una salida
    *   @attr ValueType type?: Valor de que espera el EndPipe
    */
    constructor(type) {
        super([DIRECTION.TOP], []);
        this.type = type || VALUES_TYPES.UNDEFINED;
        this.value = undefined;
        this.clean();
    }

    /*
    *   @desc: Calcula los tipos y informacion del estado del funcion
    *   @attr Context context: Context que marca los Pipe que ya se procesaron para que no se generen loops
    *   @attr IMarix board: IMatrix en la que se calcula todo
    *   @attr Direction enterDir?: Direcion desde donde se caclua en caso de ser recuiciba
    *   @attr Array<Pipe> path?: Camino de la recurcion en el calculo
    *   @return: void
    *   @scope: public
    *   @override
    */  
    calc(context, board, enterDir, path=[]) {
        if (!context.isMark(this.getPos())) {
            super.calc(context, board);
            const next = nextPipeDirection(this, DIRECTION.TOP);
            //Manejo de errores
            if (next.error) { this.addError(next.error); return }
            if (!next.pipe || !next.connected) { this.addWarning("No esta conectado a nada"); return; }
            //Process Next
            const newPath = enterDir ? [...path, this] : [this];
            if(next.dir !== enterDir) next.pipe.calc(context, board, next.inDir, newPath);
            //Setea Valores
            const type = pipeDirValueType(next.pipe, next.inDir);
            if (matchTypes(this.tempType, type)) {
                this.tempType = typeCompare(this.tempType, type);
            } else { 
                this.addError('No machean tipos');
                return;
            }
            //Post Process
            if(!this.errors && !pipeDirValueType(this)) {
                context.unMark(this.getPos());
            }
        }
    }

    /*
    *   @desc: Limpiar la informacion que se calcual en calc
    *   @return: void
    *   @scope: public
    *   @override
    */
    clean() {
        super.clean();
        this.tempType = this.type;
    }

    /*
    *   @desc: Devulve el codigo que se genera apartir de el arbol de la funcion
    *   @return: String
    *   @scope: public
    *   @override
    */
    toCode() {
        const arg = this.toCodeArg();
        return `${arg[0]}`;
    }

    /*
    *   @desc: Devuelv el PipeType que repesenta a la EndPipe
    *   @return: PipeValue
    *   @scope: public
    *   @override
    */
    getType() {
        return PIPE_TYPES.END;
    }

    /*
    *   @desc: Devuelve si la direcion es de tipo entrada
    *   @attr Direction dir: Direction que se quiere evaluar
    *   @return: Boolean
    *   @scope: public
    *   @overrides
    */
    isInDir(dir) {
        return DIRECTION.TOP === dir;
    }

    /*
    *   @desc: Devulve el valor que se guardo en la salida
    *   @return: EndValue
    *   @scope: public
    */
    getValue() {
        if (Array.isArray(this.value)) {
            if(this.value.length === 1) {
                return this.value[0];
            } else {
                return this.value;
            }
        }
        return this.value;
    }

    /*
    *   @desc: Se setea el valor de EndPipe
    *   @attr EndValue value: Valor que se desea setear
    *   @return: void
    *   @scope: public
    */
    setValue(value) {
        this.value = value;
    }

    /*
    *   @desc: Devuelve el ValueType del EndPipe
    *   @return: ValueType
    *   @scope: public
    */
    getValueType() {
        return this.tempType;
    }

    /*
    *   @desc: Devulve si el valor de matefun contine algun error
    *   @return: Boolean
    *   @scope: public
    */
    hasValueError() {
        if (Array.isArray(this.value)) {
            return !!this.value.find((value) => value.resultado.indexOf('OUTError') != -1)
        } else if(this.value) {
            return this.value.resultado.indexOf('OUTError') !== -1;
        }
    }

    /*
    *   @desc: Devuelve el texto que represnta la salida de matefun
    *   @return: String
    *   @scope: public
    */
    getValueText() {
        if (Array.isArray(this.value)) {
            if(this.value.length > 1) {
                let messages = '';
                this.value.forEach((value) => {
                    if(value.tipo === 'salida'
                        && value.resultado.indexOf('OUTError') === -1) {
                            messages += value.resultado.replace('OUT', '') + '\n';
                    }
                })
                return messages;
            } else if(this.value.length === 1) {
                return this.value[0].resultado.replace('OUT', '');
            }
        } else if(this.value && this.value.tipo === 'salida') {
            return this.value.resultado.replace('OUT', '');
        }
        return '';
    }

    /*
    *   @desc: Devulve el SnapPipe que represtnat a la EndPipe
    *   @return: PipeSnap
    *   @scope: public
    *   @override
    */
    snapshot() {
        return {
            ...(super.snapshot()),
            dir: {
                top: this.getValueType()
            },
            value: this.getValue(),
            valueText: this.getValueText(),
            hasValueError: this.hasValueError(),
        }
    }
}