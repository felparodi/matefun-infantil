import { PIPE_TYPES, VALUES_TYPES, DIRECTION } from '../../constants/constants';
import { processNext, getNextParents } from '../helpers/pipe';
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
            const parents = getNextParents(this);
            const parntesFunction = parents
                .filter((parent) => parent.getType() === PIPE_TYPES.FUNCTION);
            if(parntesFunction.length) {
                this.addError('No se puede seguir con una funcion')
            }
        }
    }

    toCode(dir, board) {
        const leftNext = processNext(this, board)(DIRECTION.LEFT)
        const left = leftNext.pipe ? leftNext.pipe.toCode() : '?';
        const upNext = processNext(this, board)(DIRECTION.TOP);
        const up = upNext.pipe ? upNext.pipe.toCode() : '?';
        const rightNext = processNext(this, board)(DIRECTION.RIGHT);
        const right = rightNext.pipe ? rightNext.pipe.toCode() : '?';
        return `${left} si ${up} \n\t o ${right}`;
    }

    getType() {
        return PIPE_TYPES.CONDITION;
    }
}