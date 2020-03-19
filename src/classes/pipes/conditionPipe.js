import { PIPE_TYPES, VALUES_TYPES, DIRECTION } from '../../constants/constants';
import { nextPipeDirection, getParentsPipeNotDummy } from '../helpers/pipe';
import { FuncPipe } from './funcPipe';

const { GENERIC, BOOLEAN} = VALUES_TYPES;

/*
* @TODO: todo
*/
export class ConditionPipe extends FuncPipe {

    constructor() {
       super('SI', [GENERIC, BOOLEAN, GENERIC], GENERIC);
    }

    calc(context, board, enterDir, path) {
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

    toCode() {
        const leftNext = nextPipeDirection(this, DIRECTION.LEFT)
        const left = leftNext.pipe ? leftNext.pipe.toCode() : '?';
        const upNext = nextPipeDirection(this, DIRECTION.TOP);
        const up = upNext.pipe ? upNext.pipe.toCode() : '?';
        const rightNext = nextPipeDirection(this, DIRECTION.RIGHT);
        const right = rightNext.pipe ? rightNext.pipe.toCode() : '?';
        return `${left} si ${up} \n\t o ${right}`;
    }

    getType() {
        return PIPE_TYPES.CONDITION;
    }
}