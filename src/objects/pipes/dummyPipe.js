import { PIPE_TYPES } from '../../constants/constants';
import { Pipe } from './pipe';

export class DummyPipe extends Pipe {

    constructor(inDirection, outDirection) {
        super([inDirection],[outDirection]);
    }

    getOutType() {
        const parents = this.getParents();
        const inTypePerParent = parents.map(parent => parent.hasOutType() ? parent.getOutType() : new Array());
        return new Array().concat(...inTypePerParent);
    }

    getInType() {
        const childrens = this.getChildrens();
        const inTypePerChildren = childrens.map(children => children.hasInType() ? children.getInType() : new Array());
        return new Array().concat(...inTypePerChildren);
    }

    hasOutType() {
        return this.getOutType().length > 0;
    }

    toString() {
        return this.toStringArg()
    }

    hasInType() {
        return this.getInType().length > 0;
    }

    getType() {
        return PIPE_TYPES.DUMMY;
    }
}