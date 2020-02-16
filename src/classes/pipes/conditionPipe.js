import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext } from './pipe';
import { FuncPipe } from './funcPipe';
import { METHOD_FUNCTION } from '../../constants/constants'
import { DIRECTION } from '../../constants/constants.js'


/*
* @TODO: todo
*/
export class ConditionPipe extends FuncPipe {

    constructor() {
       super('IF', [VALUES_TYPES.GENERIC, VALUES_TYPES.BOOLEAN, VALUES_TYPES.GENERIC], [VALUES_TYPES.GENERIC]);
    }

    toCode(dir, board) {
        const leftNext = processNext(this, board)(DIRECTION.LEFT)
        const left = leftNext.pipe ? leftNext.pipe.toCode() : '?';
        const upNext = processNext(this, board)(DIRECTION.TOP);
        const up = upNext.pipe ? upNext.pipe.toCode() : '?';
        const rightNext = processNext(this, board)(DIRECTION.RIGHT);
        const right = rightNext.pipe ? rightNext.pipe.toCode() : '?';
        return `${left} si ${up} \n o ${right}`;
    }

    getType() {
        return PIPE_TYPES.CONDITION;
    }
}