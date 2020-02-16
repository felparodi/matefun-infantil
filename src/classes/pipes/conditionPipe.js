import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext } from './pipe';
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
        const left = processNext(this)(DIRECTION.LEFT).toCode();
        const up = processNext(this)(DIRECTION.TOP).toCode();
        const right = processNext(this)(DIRECTION.RIGHT).toCode();
        return `${left} si ${up} \n o ${right}`;
    }

    getType() {
        return PIPE_TYPES.CONDITION;
    }
}