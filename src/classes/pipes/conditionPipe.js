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
        //@TODO Si son distintos izaquierd  derecha no se que hacer
        const inType = VALUES_TYPES.UNDEFINED;
        return [inType, VALUES_TYPES.BOOLEAN, inType];
    }

    getOutType() {
        //@TODO Si son distintos izaquierd  derecha no se que hacer
        const leftType = this.getInType(DIRECTION.LEFT);
        const rightType = this.getInType(DIRECTION.RIGHT);
        return leftType === rightType ? leftType : DIRECTION.UNDEFINED;
    }

    toCode() {
        const left = processNext(this)(DIRECTION.LEFT).toCode();
        const up = processNext(this)(DIRECTION.TOP).toCode();
        const right = processNext(this)(DIRECTION.RIGHT).toCode();
        return `${left} si ${up} \n o ${right}`;
    }

    getType() {
        return PIPE_TYPES.CONDITION;
    }
}