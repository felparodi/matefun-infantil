import { PIPE_TYPES, VALUES_TYPES, DIRECTION } from '../../constants/constants';
import * as messages from '../../constants/messages';
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
    *   @override
    */
    calc(context, board, enterDir, path=[]) {
        const marked = context.isMark(this.getPos());
        super.calc(context, board, enterDir, path);
        if(!marked) {
            const parents = getParentsPipeNotDummy(this);
            const parentsFunction = parents
                .filter((parent) => parent.getType() === PIPE_TYPES.FUNCTION);
            if(parentsFunction.length) {
                this.addError(messages.NO_NEXT_FUNC);
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
        const left = leftNext.pipe ? leftNext.pipe.toCode() : '()';
        const upNext = nextPipeDirection(this, DIRECTION.TOP);
        const up = upNext.pipe ? upNext.pipe.toCode() : '()';
        const rightNext = nextPipeDirection(this, DIRECTION.RIGHT);
        const right = rightNext.pipe ? rightNext.pipe.toCode() : '()';
        return `${left} si ${up} \n\t o ${right}`;
    }

    toTree() {
        const leftNext = nextPipeDirection(this, DIRECTION.LEFT)
        const pass = leftNext.pipe ? leftNext.pipe.toTree() : null;
        const upNext = nextPipeDirection(this, DIRECTION.TOP);
        const condition = upNext.pipe ? upNext.pipe.toTree() : null;
        const rightNext = nextPipeDirection(this, DIRECTION.RIGHT);
        const notPass = rightNext.pipe ? rightNext.pipe.toTree() : null;
        return { 
            type: 'condition', 
            condition, 
            pass, 
            notPass 
        };
    }

    /*
    *   @desc: Devuelve el PipeType que repesenta a la ConditionPipe
    *   @return: PipeValue
    *   @scope: public
    *   @override
    */
    getType() {
        return PIPE_TYPES.CONDITION;
    }
}