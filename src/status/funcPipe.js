import {Pipe, FUNCTION } from './pipe'
import {ValPipe} from './valPipe'

export class FuncPipe extends ValPipe {

    constructor(name, inType, outType) {
       super(name);
       this.pendingTypes = inType;
       this.setInType(inType);
       this.setOutType(outType);
    }

    toString() {
        const arg = this.toStringArg();
        return `${this.value}(${arg})`
    }

    getType() {
        return FUNCTION;
    }

    matchToIn(p) {
        const thisInType = this.pendingTypes;
        const otherOutType = p.getOutType();
        if (thisInType.length >= otherOutType.length ) {
            for (let i = 0; i < otherOutType.length; i++) {
                if(thisInType[i] !== otherOutType[i]) return false
            }
            return true;
        }
        return false;
    }

    joinIn(p, dir) {
       super.joinIn(p);
       this.pendingTypes = this.pendingTypes.splice(p.getOutType().length);
    }

}