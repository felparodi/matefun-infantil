import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import { Pipe } from './pipe';
import { METHOD_FUNCTION } from '../../constants/constants'
import { DIRECTION } from '../../constants/constants.js'


/*
* @TODO: todo
*/
export class ConditionPipe extends FuncPipe {

    constructor() {
       super([DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT], DIRECTION.BOTTOM);
    }


    toCode(direction, blockVars) {
        //console.log('FuncPipe.toCode.this', this)
        //console.log('FuncPipe.toCode.getParents', this.getParents())
        const arg = this.toCodeArg(direction, blockVars);
        const argv = arg.split(', ');
        return "_ si _ \n o _"
    }

    getType() {
        return PIPE_TYPES.CONDITION;
    }

}