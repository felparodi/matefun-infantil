import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext, invertDirection, isMarked, matchTypes, isDefined } from './pipe';

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
        super.clean();
        this.tempType = VALUES_TYPES.UNDEFINED;
        this.inProcess = false;
        this.tempInDirection = undefined;
    }

    //@TODO Loops
    calc(context, board, path) {;
        if(!isMarked(context, this)) {
            const inPath =  invertDirection(path);
            this.inProcess = true;
            super.calc(context, board, path);
            const dirs = this.getAllDirection();
            const nexts = dirs.map((dir) => processNext(this, board)(dir))
                .sort((n1, n2) =>
                        n1.pipe && n1.pipe.getType() === PIPE_TYPES.DUMMY ? 1 :
                        n2.pipe && n2.pipe.getType() === PIPE_TYPES.DUMMY ? -1 : 0);

            nexts.forEach(next => {
                if(!next.pipe) { this.addWarning(`No coneccion1 ${next.dir}`); return; }
                if(this.errors && this.errors.length > 0) return;
                if(next.dir !== inPath) next.pipe.calc(context, board, next.dir);
                let type;

                if (next.dir === DIRECTION.TOP) {
                    if ((next.pipe.getType() !== PIPE_TYPES.DUMMY) 
                        || (next.pipe.isDummyOut(invertDirection(next.dir)))) {
                            this.tempInDirection = next.dir
                    }
                    type = next.pipe.getOutType();
                } else {
                    if (next.pipe.getType() === PIPE_TYPES.DUMMY 
                        && next.pipe.isDummyOut(invertDirection(next.dir))) {
                        this.tempInDirection = next.dir;
                    }
                    type = next.pipe.getInType(invertDirection(next.dir));
                }

                if (!type) { this.addWarning(`No coneccion ${next.dir}`); return; }
                if (!matchTypes(this.tempType, type)) { this.addError('No machean tipos') }
                if (!isDefined(this.tempType)) {
                    this.tempType = type;
                }
            });
            this.inProcess = false;
        } else if(this.inProcess) {
            this.addError('Loop');
        }
        
    }

    isDummyOut(direction) {
        return this.tempInDirection !== direction;
    }

    getInDirections() {
        return this.tempInDirection ? [this.tempInDirection] : [];
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