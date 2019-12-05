import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import {ValPipe} from './valPipe'

export class FuncPipe extends ValPipe {

    constructor(name, inDirections, outDirections) {
       super(name, outDirections);
       this.setInDirection(inDirections);
       this.setOutType(VALUES_TYPES.FUNCTION);
    }

    toCode(direction) {
        //console.log('FuncPipe.toCode.this', this)
        //console.log('FuncPipe.toCode.getParents', this.getParents())
        const arg = this.toCodeArg();
        return `${this.value}(${arg})`;
    }

    getType() {
        return PIPE_TYPES.FUNCTION;
    }

}