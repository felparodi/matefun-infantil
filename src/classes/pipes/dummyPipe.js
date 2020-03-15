import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { invertDirection } from '../helpers/direction';
import { matchTypes, isDefined, pipeDirValueType, pipeTypeDefined, typeCompare} from '../helpers/type';
import { processNext, sortPipe } from '../helpers/pipe';
import { Pipe } from './pipe';

export class DummyPipe extends Pipe {

    constructor(dir1, dir2, dir3, dir4) {
        super([dir1], [dir2,dir3,dir4].filter(dir => dir));
        this.clean();
    }

    startWork() {
        this.isWorking = true;
    }
    endWork() {
        this.isWorking = false;
    }

    addDir(dir) {
        const inDir = super.getInDirections();
        const outDir = super.getOutDirections();
        if(inDir.length === 0 && outDir.length === 0) {
            this.setInDirection([dir]);
        } else if(!inDir.find(d => d === dir) && !outDir.find(d => d === dir)) {
            this.setOutDirections([...outDir, dir])
        }
    }

    clean() {
        super.clean();
        this.tempType = VALUES_TYPES.UNDEFINED;
        this.inProcess = false;
        this.tempInDirection = undefined;
        this.tempOutDirs = [];
    }

    //Private
    addOutDir(direction) {
        if(this.tempOutDirs.indexOf(direction) === -1) {
            this.tempOutDirs.push(direction);
            const allDirections = this.getAllDirection();
            if((this.tempOutDirs.length + 1) === allDirections.length) {
                this.tempInDirection = allDirections.find((dir) => this.tempOutDirs.indexOf(dir) === -1);
            }
        }
    }

    //Private
    addInDir(direction) {
        this.tempInDirection = direction;
        const allDirections = this.getAllDirection();
        this.tempOutDirs = allDirections.filter((dir) => dir !== direction);
    }

    //@TODO Loops
    calc(context, board, enterDir, path) {;
        if(!context.isMark(this.getPos())) {
            context.mark(this.getPos());
            const dirs = this.getAllDirection();
            const nexts = dirs.map((dir) => processNext(this, board)(dir))
                .sort((n1, n2) => sortPipe(n1.pipe, n2.pipe));

            nexts.forEach(next => {
                if(this.errors) { return; }
                if(next.error) { this.addError(next.error); return; }
                if(!next.pipe || !next.connected) { this.addWarning(`No coneccion ${next.dir}`); return; }
                const newPath = enterDir ? [...path, this] : [this];
                if(next.dir !== enterDir) { next.pipe.calc(context, board, next.dir, newPath); }

                if (next.pipe.isInDir(next.inDir)) {
                    if(this.isInDir(next.dir)) {
                        this.addError('Loop'); return;
                    } else {
                        this.addOutDir(next.dir);
                    }
                } else if(next.pipe.isOutDir(next.inDir)) {
                    if(this.isOutDir(next.dir)) {
                        this.addError('Loop'); return;
                    } else {
                        this.addInDir(next.dir);
                    }
                }

                const type = pipeDirValueType(next.pipe, next.inDir);
                if (matchTypes(this.tempType, type)) {
                    this.tempType = typeCompare(this.tempType, type);
                } else { 
                    this.addError('No machean tipos');
                    return;
                }
            });
            if(!this.errors && !pipeTypeDefined(this)) {
                context.unMark(this.getPos());
            }       
        }
    }

    toCode(dir, board) {
        return this.toCodeArg(dir, board).join(', ');
    }

    getType() {
        return PIPE_TYPES.DUMMY;
    }

    getValueType() {
        return this.tempType;
    }

    setValueType(type) {
        this.tempType = type;
    }

    isInDir(dir) {
        return this.tempInDirection === dir;
    }

    isOutDir(dir) {
        return this.tempOutDirs.indexOf(dir) !== -1;
    }

    getInDirections() {
        return this.tempInDirection ? [this.tempInDirection] : []
    }

    getOutDirections() {
        return this.tempOutDirs;
    }

    snapshot() {
        const valueType = this.getValueType();
        const dir = {};
        this.getAllDirection().forEach((direction) => {
            switch(direction) {
                case DIRECTION.TOP:
                    dir.top = valueType;
                    break;
                case DIRECTION.BOTTOM:
                    dir.bottom = valueType;
                    break;
                case DIRECTION.RIGHT:
                    dir.right = valueType;
                    break;
                case DIRECTION.LEFT:
                    dir.left = valueType;
                    break;
            }
        })
        return {
            ...(super.snapshot()),
           dir,
           isWorking: this.isWorking,
        }
    }
}