import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import {ValPipe} from './valPipe'
import { METHOD_FUNCTION } from '../../constants/constants'

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

    toCode(direction, blockVars) {
        //console.log('FuncPipe.toCode.this', this)
        //console.log('FuncPipe.toCode.getParents', this.getParents())
        const arg = this.toCodeArg(direction, blockVars);
        const argv = arg.split(', ');
        switch(this.name) {
            case METHOD_FUNCTION.ADD:
                return `(${argv[0]} + ${argv[1]})`;
            case METHOD_FUNCTION.SUB:
                return `(${argv[0]} - ${argv[1]})`
            case METHOD_FUNCTION.MUL:
                return `(${argv[0]} * ${argv[1]})`
            case METHOD_FUNCTION.DIV:
                return `(${argv[0]} / ${argv[1]})`
            default:
                return `${this.name}(${arg})`;
        }
    }

    getType() {
        return PIPE_TYPES.FUNCTION;
    }

}