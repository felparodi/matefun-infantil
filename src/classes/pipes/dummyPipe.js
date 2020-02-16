import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext, invertDirection, isMarked } from './pipe';

function dummyInFilter(pipe) {
    return (dir) => {
        const pipeDir =  processNext(pipe)(dir);
        if (!pipeDir) return false;
        if(pipeDir.pipe === null) return true;
        if(pipeDir.pipe.getType() === PIPE_TYPES.DUMMY) {
            return pipeDir.pipe.isDummyOut(invertDirection(dir));
        }
        return pipeDir.pipe.isOutDirection(invertDirection(dir));
    }
}

export class DummyPipe extends Pipe {

    constructor(dir1, dir2, dir3, dir4) {
        super([dir1], [dir2,dir3,dir4].filter(dir => dir));
     
    }

    clean() {
        this.tempType = VALUES_TYPES.UNDEFINED;
        this.inProcess = false;
    }

    calc(context, board, path) {
        debugger;
        if(!isMarked(context, this)) {
            const inPath =  invertDirection(path);
            this.inProcess = true;
            super.calc(context, this);
            const dirs = this.getAllDirection().filter((d) => d !== inPath);
            const nexts = dirs.map((dir) => processNext(this, board)(dir));

            this.tempType = nexts
                .filter(n => n.pipe)
                .map(next => {
                    next.pipe.calc(context, board, next.dir);
                    const type = next.dir === DIRECTION.TOP ? 
                        next.pipe.getOutType() : 
                        next.pipe.getInType(invertDirection(next.dir));
                    if (!type) { this.addWarning(`No coneccion ${next.dir}`) }
                    return type;
                })
                .reduce((ac, ty) => {
                    if (ty !== VALUES_TYPES.UNDEFINED) {
                        if(ac !== VALUES_TYPES.UNDEFINED && ac !== ty) this.addError('No machean tipos')
                        return ty
                    }
                    return ac;
                }, VALUES_TYPES.UNDEFINED);
                
        } else if(this.inProcess) {
            this.addError('Loop');
        }
        this.inProcess = false;
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
        return this.getAllDirection().filter(dir => inDirections.indexOf(dir) === -1)
    }

    hasOutType() {
        return this.getOutType().length > 0;
    }

    toCode(dir, board) {
        return this.toCodeArg(dir, board);
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

    getOutType() {
        return this.tempType;
    }

    getInType() {
        return this.tempType;
    }

    getValueType() {
        return this.tempType;
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            allDirections: this.getAllDirection(),
            valueType: this.getValueType(),
        }
    }
}