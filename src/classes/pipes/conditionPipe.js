import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import {ValPipe} from './valPipe'
import { METHOD_FUNCTION } from '../../constants/constants'
import { DIRECTION } from '../../constants/constants.js'

export class ConditionPipe extends Pipe {

    constructor() {
       super([DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT], DIRECTION.BOTTOM);
       this.setInDirection(inDirections);
       this.setOutType(VALUES_TYPES.FUNCTION);
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