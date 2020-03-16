import { PIPE_TYPES, VALUES_TYPES, DIRECTION } from '../../constants/constants';
import { processNext } from '../helpers/pipe';
import { FuncPipe } from './funcPipe';

/*
* @TODO: todo
*/
export class ConditionPipe extends FuncPipe {

    constructor() {
       super('SI', [VALUES_TYPES.GENERIC, VALUES_TYPES.BOOLEAN, VALUES_TYPES.GENERIC], VALUES_TYPES.GENERIC);
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