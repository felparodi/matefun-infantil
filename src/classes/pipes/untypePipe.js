import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import { Pipe } from './pipe';

export class UnTypePipe extends Pipe {

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

}