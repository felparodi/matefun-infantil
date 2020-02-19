import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { Pipe, processNext, invertDirection, isMarked, sortPipe, matchTypes, isDefined } from './pipe';

export class DummyPipe extends Pipe {

    constructor(dir1, dir2, dir3, dir4) {
        super([dir1], [dir2,dir3,dir4].filter(dir => dir));
     
    }

    clean() {
        super.clean();
        this.tempType = VALUES_TYPES.UNDEFINED;
        this.inProcess = false;
        this.tempInDirection = undefined;
        this.tempOutDirs = [];
    }

    //@TODO Loops
    calc(context, board, path) {;
        if(!isMarked(context, this)) {
            const inPath =  invertDirection(path);
            this.inProcess = true;
            super.calc(context, board, path);
            const dirs = this.getAllDirection();
            const nexts = dirs.map((dir) => processNext(this, board)(dir))
                .sort((n1, n2) => sortPipe(n1.pipe, n2.pipe));

            nexts.forEach(next => {
                //if(this.errors && this.errors.length > 0) return;
                if(next.error) { this.addError(next.error); return }
                if(!next.pipe) { this.addWarning(`No coneccion ${next.dir}`); return; }
                if(next.dir !== inPath) next.pipe.calc(context, board, next.dir);

                const nextInvDir = invertDirection(next.dir);
                const type = next.pipe.getDirType(nextInvDir);
                if (!type) { this.addWarning(`No coneccion ${next.dir}`); return; }

                const allDirections =  this.getAllDirection();

                if (next.pipe.isOutDir(nextInvDir)) {
                    if (!next.pipe.isInDir(nextInvDir)) {
                        if(!this.tempInDirection && this.tempOutDirs.indexOf(next.dir) < 0) {
                            this.tempInDirection = next.dir;
                            this.tempOutDirs = allDirections.filter((dir) => dir !== next.dir);
                        } else if(this.tempInDirection !== next.dir) {
                            this.addError('Loop'); 
                            return;
                        }
                    }
                } else {
                    if (next.pipe.isInDir(nextInvDir)) {
                        if (this.tempInDirection === next.dir) {
                            this.addError('Loop');
                            return;
                        } else if(this.tempOutDirs.indexOf(next.dir) < 0) {
                            this.tempOutDirs.push(next.dir)
                            if(this.tempOutDirs.length === allDirections.length) {
                                this.addError('Loop'); 
                                return;
                            } else if((this.tempOutDirs.length + 1) ===  allDirections.length) {
                                this.tempInDirection = allDirections.find((dir) => this.tempOutDirs.indexOf(dir) < 0);
                            }
                        }
                    }
                }

                if (!matchTypes(this.tempType, type)) { this.addError('No machean tipos') }
                if (!isDefined(this.tempType) && type !== VALUES_TYPES.UNDEFINED) {
                    this.tempType = type;
                }
            });

            if(!this.tempInDirection && this.tempOutDirs.length === 0) {
                this.addWarning('Unconected'); 
            }
            this.inProcess = false;
        }
    }

    getInDirections() {
        return this.tempInDirection ? [this.tempInDirection] : [];
    }

    getOutDirections() {
        const inDirections = this.getInDirections();
        return this.getAllDirection().filter(dir => inDirections.indexOf(dir) === -1)
    }

    toCode(dir, board) {
        return this.toCodeArg(dir, board);
    }

    isOutDirection(direction) {
        return this.getAllDirection().indexOf(direction) >= 0;
    }

    getType() {
        return PIPE_TYPES.DUMMY;
    }

    getOutType() {
        return this.tempType;
    }

    getValueType() {
        return this.tempType;
    }

    isInDir(dir) {
        return !this.tempInDirection || this.tempInDirection === dir;
    }

    isOutDir(dir) {
        
        return (this.getAllDirection().length - 1) > this.tempOutDirs.length || this.tempOutDirs.indexOf(dir) >= 0;
    }

    setDirType(direction, type) {
        if(this.getAllDirection().indexOf(direction) >= 0) {
            this.tempType = type;
        }
    }

    getDirType(direction) {
        return this.getAllDirection().indexOf(direction) >= 0 ? this.tempType : null;
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            allDirections: this.getAllDirection(),
            valueType: this.getValueType(),
        }
    }
}