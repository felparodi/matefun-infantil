import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import {ValPipe} from './valPipe'

export class FuncPipe extends ValPipe {

    constructor(name, inDirections, outDirections) {
       super(name, outDirections);
       this.setName(name);
       this.setInDirection(inDirections);
       this.setOutType(VALUES_TYPES.FUNCTION);
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
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