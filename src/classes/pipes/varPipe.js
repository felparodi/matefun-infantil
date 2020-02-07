import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import { Pipe } from './pipe';

/*
*   Attr
*   - index: String
*/
export class VarPipe extends Pipe {

    constructor(type) {
        super([], [DIRECTION.BOTTOM]);
        this.type = type;
        this.index = undefined;
    }

    setIndex(index) {
        this.index = index;
    }

    getIndex(index) {
        return this.index;
    }

    getOutType() {
        console.log('VarPipe.getOutType')
        if (this.type) {
            return this.type;
        }
        const childrens = this.getChildrens();
        const inTypePerChildren = childrens.map(children => children.hasInType() ? children.getInType() : new Array());
        console.log(inTypePerChildren);
        return new Array().concat(...inTypePerChildren);
    }

    getName() {
        return `x${this.index}`
    }

    toCode(direction, blockVar) {
        return `${this.getName()}`;
    }

    getType() {
        return PIPE_TYPES.VARIABLE;
    }
}