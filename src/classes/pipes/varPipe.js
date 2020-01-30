import { PIPE_TYPES } from '../../constants/constants';
import { ConstPipe } from './constPipe'

/*
*   Attr
*   - index: String
*/
export class VarPipe extends ConstPipe {

    constructor(type, name) {
        super(type);
        this.index = undefined;
    }

    setIndex(index) {
        this.index = index;
    }

    getName(blockVar) {
        return `${blockVar.vars[this.index].name}`
    }

    toCode(direction, blockVar) {
        return `${blockVar.vars[this.index].name}`;
    }

    getType() {
        return PIPE_TYPES.VARIABLE;
    }
}