import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext } from './pipe';
import { METHOD_FUNCTION } from '../../constants/constants'
import { DIRECTION } from '../../constants/constants.js'


/*
* @TODO: todo
*/
export class ConditionPipe extends FuncPipe {

    constructor() {
       super([DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT], [DIRECTION.BOTTOM]);
    }

    getInTypes() {
        const inType = VALUES_TYPES.UNDEFINED;
        return [inType, VALUES_TYPES.BOOLEAN, inType];
    }

    getOutTypes() {
        const outType = VALUES_TYPES.UNDEFINED;
        return [outType];
    }

    toCode(direction, blockVars) {
        const left = processNext(this)(DIRECTION.LEFT).toCode(DIRECTION.LEFT, blockVars);
        const up = processNext(this)(DIRECTION.TOP).toCode(DIRECTION.TOP, blockVars);
        const right = processNext(this)(DIRECTION.RIGHT).toCode(DIRECTION.RIGHT, blockVars);
        return `${left} si ${up} \n o ${right}`;
    }

    getType() {
        return PIPE_TYPES.CONDITION;
    }

}