import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import { UnTypePipe } from './untypePipe';
import { processNext, invertDirection } from './pipe';

function dummyInFilter(pipe) {
    return (dir) => {
        const pipeDir =  processNext(pipe)(dir);
        if(pipeDir.pipe === null) return false;
        if(pipeDir.pipe.getType() === PIPE_TYPES.DUMMY) {
            return pipeDir.pipe.isDummyOut(invertDirection(dir));
        }
        return true;
    }
}

export class DummyPipe extends UnTypePipe {

    constructor(inDirections, outDirections) {
        super(inDirections, outDirections);
    }

    isDummyOut(direction) {
        const otherDir = this.getAllDirection().filter(dir => dir !== direction)
        const inDir = otherDir.filter(dummyInFilter(pipe));
        return inDir.length > 0;
    }

    getAllDirection() {
        const setDir = new Set()
        this.inDirections.forEach((value) => setDir.add(value))
        this.outDirections.forEach((value) => setDir.add(value))
        const directionList = new Array()
        setDir.forEach((value) => directionList.push(value))
        return directionList;
    }

    getInDirections() {
        return this.getAllDirection().filter(dummyInFilter(this))
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

    getParents(outDirections) {
        //console.log('getParents.this', this);
        if(this.board == null || this.posX === null || this.posY === null) {
            return new Array();
        }

        //console.log('getParents.getInDirections', this.getInDirections());
        debugger
        return this.getAllDirection()
            .filter(dir => dir !== outDirections)
            .map(processNext(this))
        //console.log('getParents.parents', parents);
        //return parents.filter(parent => parent.pipe !== null && parent.pipe !== undefined);
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