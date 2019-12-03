import { PIPE_TYPES, VALUES_TYPES } from '../constants/constants';
import {Pipe} from './pipe'
import {ValPipe} from './valPipe'

export class FuncPipe extends ValPipe {

    constructor(name, inDirections, outDirections) {
       super(name, outDirections);
       this.setInDirection(inDirections);
       this.setOutType(VALUES_TYPES.FUNCTION);
    }

    toString() {
        const arg = this.toStringArg();
        return `${this.value}(${arg})`;
    }

    getType() {
        return PIPE_TYPES.FUNCTION;
    }

}