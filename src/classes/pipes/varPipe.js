import { PIPE_TYPES, DIRECTION, VALUES_TYPES  } from '../../constants/constants';
import * as messages from '../../constants/messages';
import { matchTypes, evalValueType, valueToString, typeCompare } from '../helpers/type';
import { processNext, validateDirType, pipeTypeDefined } from '../helpers/pipe';
import { Pipe } from './pipe';

/*
*   @desc: Esta Pipe representa las variables de una funcion
*   @attr Int index:
*   @attr Value value:
*   @attr ValueType type:
*   @attr ValueType tempType: 
*   @scope: public
*/
export class VarPipe extends Pipe {

    /*
    *   @desc: Constuct de la Variable, se le puede asiganra el tipo
    *   @attr ValueType type?: Typo que se quiere crear la variable
    *   @scope: public
    */
    constructor(type=VALUES_TYPES.UNDEFINED) {
        super([], [DIRECTION.BOTTOM]);
        this.type = type;
        this.value = undefined;
        this.clean();
    }

    /*
    *   @desc: Seta un valor en la variable, en caso de mapear con el tipo de la misma
    *   @attr Value value:
    *   @return: void
    *   @scope: public
    */
    setValue(value) {
        const type = evalValueType(value);
        if(!matchTypes(this.getValueType(), type)) {
            throw new Error('No se puede asiganar el valor ya que es de otro tipo')
        }
        this.value = value;
        this.type = typeCompare(this.type, type);
    }

    /*
    *   @desc: Devuelve el valor que esta en la VarPipe
    *   @return: Value
    *   @scope: public
    */
    getValue() {
        return this.value;
    }

    /*
    *   @desc: Limpia todos los valores que se calculan
    *   @return: void
    *   @scope: public
    */
    clean() {
        super.clean();
        this.index = undefined
        this.tempType = this.type;
    }

    /*
    *   @desc: Calcula el tempType y los mesajes de error o warnig de una VarPipe
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
            context.mark(this.getPos());

            this.index = this.index || context.getIndex();

            const next = processNext(this, board)(DIRECTION.BOTTOM)
            if (next.error) { this.addError(next.error); return; }
            if (!next.pipe || !next.connected) {this.addWarning(messages.NO_CONNECTED); return;}
            const newPath = enterDir ? [...path, this] : [this];
            if (next.dir !== enterDir) { next.pipe.calc(context, board, next.inDir, newPath); }

            const status = validateDirType(this, next);
            if (status.error) { this.addError(status.error); return; }
            if (status.warning) { this.addWarning(status.warning); }
            if (status.valid) { this.tempType = status.type; }
            if (this.tempType === VALUES_TYPES.BOOLEAN) { this.addError(messages.NO_BOOLEAN); return; }
            if(!this.errors && !pipeTypeDefined(this)) {
                context.unMark(this.getPos());
            }
        }
    }

    /*
    *   @desc: Devuelve si es una direcion de salida valida
    *   @attr Direction dir:
    *   @return: Boolean
    *   @scope: public
    *   @override
    */
    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM
    }

    /*
    *   @desc: Devuelve el ValueType de la variable
    *   @return: ValueType
    *   @scope: public
    */
    getValueType() {
        return this.tempType;
    }

    /*
    *   @desc: Devuelve el nombre de la varialbe que representa la VarPipe
    *   @return: String
    *   @scope: public
    */
    getName() {
        return `x${this.index}`
    }

    /*
    *   @desc: Devuelve el codio que es el nombre de la varialbe que representa
    *   @return: String
    *   @scope: public
    */
    toCode() {
        return `${this.getName()}`;
    }

    toTree() {
        return { 
            type: 'value',
            subType: 'var', 
            name: this.getName(), 
            value: this.getValue(), 
            valueType: this.getValueType()
        }
    }

    /*
    *   @desc: Devuelve el valor que esta contenido en la VarPipe
    *   @return: String
    *   @scope: public
    */
    getValueEval() {
       return valueToString(this.getValue(), this.getValueType());
    }

    /*
    *   @desc: Devuelve el PipeType que representa el VarPipe
    *   @return: PipeType
    *   @scope: public
    *   @override  
    */
    getType() {
        return PIPE_TYPES.VARIABLE;
    }

    /*
    *   @desc: Devulve una esturctura que represeta la informacion de la VarPipe
    *   @return: SnapPipe
    *   @scope: public
    *   @override
    */
    snapshot() {
        const value = this.getValue();
        return {
            ...(super.snapshot()),
            name: this.getName(),
            dir: {
                bottom: this.getValueType(),
            },
            originDir: {
                bottom: this.type
            },
            value,
            valueText: valueToString(value, this.getValueType())
        }
    }
}