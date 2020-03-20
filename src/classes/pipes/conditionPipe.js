import { PIPE_TYPES, VALUES_TYPES, DIRECTION } from '../../constants/constants';
import { nextPipeDirection, getParentsPipeNotDummy } from '../helpers/pipe';
import { FuncPipe } from './funcPipe';

const { GENERIC, BOOLEAN} = VALUES_TYPES;

/*
*   @desc: Este Pipe representa una Condicion en el arbol de deciones
*/
export class ConditionPipe extends FuncPipe {

    /*
    *   @desc: Constructor
    *   @scope: public
    */
    constructor() {
       super('SI', [GENERIC, BOOLEAN, GENERIC], GENERIC);
    }

    /*
    *   @desc: Calcula lo misco que la funciones, 
    *       ademas tiene un error si tiene un padre que esea de tipo funcion
    *   @attr Context context: Context que marca los Pipe que ya se procesaron para que no se generen loops
    *   @attr IMarix board: IMatrix en la que se calcula todo
    *   @attr Direction enterDir?: Direcion desde donde se caclua en caso de ser recuiciba
    *   @attr Array<Pipe> path?: Camino de la recurcion en el calculo
    *   @return: void
    *   @scope: public
    *   @overide
    */
    calc(context, board, enterDir, path=[]) {
        const marked = context.isMark(this.getPos());
        super.calc(context, board, enterDir, path);
        if(!marked) {
            const parents = getParentsPipeNotDummy(this);
            const parntesFunction = parents
                .filter((parent) => parent.getType() === PIPE_TYPES.FUNCTION);
            if(parntesFunction.length) {
                this.addError('No se puede seguir con una funcion')
            }
        }
    }

    /*
    *   @desc: Devuelve el codigo que representa una condicon en matfun
    *   @return: String
    *   @scope: public
    */
    toCode() {
        const leftNext = nextPipeDirection(this, DIRECTION.LEFT)
        const left = leftNext.pipe ? leftNext.pipe.toCode() : '?';
        const upNext = nextPipeDirection(this, DIRECTION.TOP);
        const up = upNext.pipe ? upNext.pipe.toCode() : '?';
        const rightNext = nextPipeDirection(this, DIRECTION.RIGHT);
        const right = rightNext.pipe ? rightNext.pipe.toCode() : '?';
        return `${left} si ${up} \n\t o ${right}`;
    }

    /*
    *   @desc: Devuelve el PipeType que repesenta a la ConditionPipe
    *   @return: PipeValue
    *   @scope: public
    *   @overide
    */
    getType() {
        return PIPE_TYPES.CONDITION;
    }
}