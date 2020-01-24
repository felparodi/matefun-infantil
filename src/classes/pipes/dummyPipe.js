import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import { UnTypePipe } from './untypePipe';
import { processNext, invertDirection } from './pipe';

function dummyInFilter(pipe) {
    return (dir, index, list) => {
        const pipeDir =  processNext(pipe)(dir);
        if(pipeDir.pipe === null) return true;
        if(pipeDir.pipe.getType() === PIPE_TYPES.DUMMY) {
            return pipeDir.pipe.isDummyOut(invertDirection(dir));
        }
        return pipeDir.pipe.isOutDirection(invertDirection(dir));
    }
}

export class DummyPipe extends UnTypePipe {

    constructor(dir1, dir2, dir3, dir4) {
        super([dir1], [dir2,dir3,dir4].filter(dir => dir != undefined));
    }

    isDummyOut(direction) {
        const allDir = this.getAllDirection();
        if (allDir.indexOf(direction) === -1) return false;
        const otherDir = allDir.filter(dir => dir !== direction)
        const inDir = otherDir.filter(dummyInFilter(this));
        return inDir.length > 0;
    }

    getInDirections() {
        return this.getAllDirection().filter(dummyInFilter(this)).slice(0,1)
    }

    getOutDirections() {
        const inDirections = this.getInDirections();
        return this.getAllDirection().fill(dir => inDirections.indexOf(dir) === -1)
    }

    hasOutType() {
        return this.getOutType().length > 0;
    }

    toCode(direction, blockVars) {
        this.setInToOut(direction);
        return this.toCodeArg(direction, blockVars)
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
        return this.getAllDirection().indexOf(direction) >= 0;
    }

    isInDirection(direction) {
        return this.isOutDirection(direction);
    }

    getType() {
        return PIPE_TYPES.DUMMY;
    }

    getErrorFlow(direction) {
        this.setInToOut(direction);
        return super.getErrorFlow(direction);
    }
}