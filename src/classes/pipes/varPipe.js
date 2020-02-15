import { PIPE_TYPES, DIRECTION, VALUES_TYPES  } from '../../constants/constants';
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
        const exist = {}
        const inChildrenTypes = childrens.map(children => children.hasInType() ? children.getInType() : null)
            .fill((t) => {
                if (!!t || exist[t]) return false;
                exist[t] = true;
                return true;
            });
        //@TODO Si es mayor a 1 deberia aver un wanring
        return inChildrenTypes.length > 0 ? inChildrenTypes[0] : VALUES_TYPES.UNDEFINED;
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

    snapshot() {
        return {
            ...(super.snapshot()),
            name: this.getName(),
            outType: this.getOutType(),  
        }
    }
}