import { PIPE_TYPES, DIRECTION } from '../constants/constants';
import { UnTypePipe } from './untypePipe';

export class DummyPipe extends UnTypePipe {

    constructor(inDirections, outDirections) {
        super(inDirections, outDirections);
    }

    getInDirections() {
        return this.inToOut ? this.inDirections : this.outDirections;
    }

    getOutDirections() {
        return !this.inToOut ? this.inDirections : this.outDirections;
    }

    hasOutType() {
        return this.getOutType().length > 0;
    }

    toCode(direction) {
        this.setInToOut(direction);
        return this.toCodeArg()
    }

    setInToOut(direction) {
        switch(direction) {
            case DIRECTION.BOTTOM:
                this.inToOut = this.inDirections.indexOf(DIRECTION.TOP);
            case DIRECTION.TOP:
                this.inToOut = this.inDirections.indexOf(DIRECTION.BOTTOM);
            case DIRECTION.RIGHT:
                this.inToOut = this.inDirections.indexOf(DIRECTION.LEFT);
            case DIRECTION.LEFT:
                this.inToOut = this.inDirections.indexOf(DIRECTION.RIGHT);
        }
    }

    isOutDirection(direction) {
        return this.getOutDirections().indexOf(direction) || this.getInDirections().indexOf(direction);
    }

    isInDirection(direction) {
        return this.isOutDirection(direction);
    }

    hasInType() {
        return this.getInType().length > 0;
    }

    getType() {
        return PIPE_TYPES.DUMMY;
    }

    getErrorFlow(direction) {
        this.setInToOut(direction);
        return super.getErrorFlow(direction);
    }
}