import { DIRECTION, PIPE_TYPES, ERROR, VALUES_TYPES } from '../../constants/constants';

export function isMarked(context, pipe) {
    const [x, y] = pipe.getPos();
    return context.marks[x][y];
}

export function matchTypes(type1, type2) {
    return !isDefined(type1) || !isDefined(type2) || type1 === type2;
}

export function isGeneric(type) {
    const { GENERIC, GENERIC2, GENERIC3} = VALUES_TYPES;
    return type === GENERIC || type === GENERIC2 || type === GENERIC3;
}

export function isDefined(type) {
    const { UNDEFINED } = VALUES_TYPES;
    return type !== UNDEFINED && !isGeneric(type);
}

export function directionMove(pos, direction) {
    const [x, y] = pos;
    switch(direction) {
        case DIRECTION.BOTTOM:
            return [x+1, y]
        case DIRECTION.TOP:
            return [x-1, y]
        case DIRECTION.RIGHT:
            return [x, y+1]
        case DIRECTION.LEFT:
            return [x, y-1]
    }
    return [x, y]
}

export function pipeMultiTypeDefined(pipe) {
    for(let dir in DIRECTION) {
        if (pipe.hasDirection(dir) 
            && !isDefined(pipe.getDirValueType(dir))) {
            return false;
        }
    }
    return true;
}

export function pipeMonoTypeDefined(pipe) {
    return isDefined(pipe.getValueType());
}

export function pipeTypeDefined(pipe) {
    if (pipe.getValueType) return pipeMonoTypeDefined(pipe);
    if (pipe.getDirValueType) return pipeMultiTypeDefined(pipe);
    return false;
}

export function sortPipe(p1, p2) {
    if(p1 && p2) {
        const t1 = p1.getType();
        const t2 = p2.getType();
        if(t1 === t2 && t1 !== PIPE_TYPES.DUMMY && t1 !== PIPE_TYPES.VARIABLE) return 0;
        if(t1 === PIPE_TYPES.VALUE) return -1;
        if(t2 === PIPE_TYPES.VALUE) return 1;
        if(t1 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.FUNCTION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.CONDITION && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.CONDITION && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.DUMMY && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.DUMMY && pipeTypeDefined(p2)) return 1;
        if(t1 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p1)) return -1;
        if(t2 === PIPE_TYPES.VARIABLE && pipeTypeDefined(p2)) return 1;
        if(t1 === t2) return 0;
        if(t1 === PIPE_TYPES.FUNCTION) return -1;
        if(t2 === PIPE_TYPES.FUNCTION) return 1;
        if(t1 === PIPE_TYPES.CONDITION) return -1;
        if(t2 === PIPE_TYPES.CONDITION) return 1;
        if(t1 === PIPE_TYPES.VARIABLE) return -1;
        if(t2 === PIPE_TYPES.VARIABLE) return 1;
        if(t1 === PIPE_TYPES.END) return -1;
        if(t2 === PIPE_TYPES.END) return 1;
        if(t1 === PIPE_TYPES.DUMMY) return -1;
        return 1
    } else if (!p1) {
        return 1;
    } else if (!p2) {
        return -1;
    }
    return 0
}

export function invertDirection(direction) {
    switch(direction) {
        case DIRECTION.BOTTOM:
            return DIRECTION.TOP;
        case DIRECTION.TOP:
            return DIRECTION.BOTTOM;
        case DIRECTION.LEFT:
            return DIRECTION.RIGHT;
        case DIRECTION.RIGHT:
            return DIRECTION.LEFT;
    }
}

export function processNext(pipe) {
    return (direction) => {
        let next, dir, inDir, connected, children, error;
        dir = direction;
        inDir = invertDirection(direction);
        try {
            const [x, y] = directionMove(pipe.getPos(), direction);
            if (!pipe.board) { return null; }
            next = pipe.board.value(x, y);
            connected = next ?  next.hasDirection(inDir) : true;
            children = next ?  next.isOutDir(inDir) : true;
        } catch(e) {
            error = e.message;
        }
        return { pipe: next, dir, inDir, connected, children, error };
    }
}

export function typeCompare(t1, t2) {
    if(isDefined(t1)) { return t1; }
    if(isDefined(t2)) { return t2; }
    if(isGeneric(t1)) { return t1; }
    if(isGeneric(t2)) { return t2; }
    return VALUES_TYPES.UNDEFINED;
}

export function pipeDirValueType(pipe, dir) {
    if (pipe.hasDirection(dir)) {
        if (pipe.getValueType) return pipe.getValueType();
        if (pipe.getDirValueType) return pipe.getDirValueType(dir);
    }
}

export function validateDirType(pipe, next) {
    const nextInvDir = invertDirection(next.dir);
    const nextType = pipeDirValueType(next.pipe, nextInvDir);
    if (nextType) {
        const pipeDirType = pipeDirValueType(pipe, next.dir);
        if (!matchTypes(pipeDirType, nextType)) {
            return { valid: false, error: 'Tipos no conciden' }
        } 
        return { valid: true, type:typeCompare(pipeDirType, nextType) }
    } 
    return { valid: false, warning: 'Connecion Obstuida' }
}

/*
* Attr:
    posX -> Int
    posY -> Int
    board -> Matrix
    inDirections -> Array[String]
    outDirections -> Array[String]
*/
export class Pipe {

    constructor(inDirections, outDirections) {
        this.setInDirection(inDirections);
        this.setOutDirections(outDirections); 
        this.board = null;
        this.pos = [];
    }

    clean() {
        this.warnings = undefined;
        this.errors = undefined;
    }

    calc(context, board) {
        context.mark(this.pos);
    }

    addError(e) {
        if (!this.errors) this.errors = [];
        this.errors.push(e); 
    }

    addWarning(e) {
        if (!this.warnings) this.warnings = [];
        this.warnings.push(e); 
    }

    getAllDirection() {
        const setDir = new Set()
        this.inDirections.forEach((value) => setDir.add(value))
        this.outDirections.forEach((value) => setDir.add(value))
        const directionList = new Array()
        setDir.forEach((value) => directionList.push(value))
        return directionList;
    }

    hasDirection(dir) {
        return this.getAllDirection().indexOf(dir) >= 0;
    }

    setInDirection(inDirections) {
        this.inDirections = Array.isArray(inDirections) ? inDirections : inDirections ? [ inDirections ] : new Array();
    }

    setOutDirections(outDirections) {
        this.outDirections = Array.isArray(outDirections) ? outDirections : outDirections ? [ outDirections ] : new Array();
    }

    getInDirections() {
        return this.inDirections;
    }

    getOutDirections() {
        return this.outDirections;
    }

    setPos(x, y) {
        this.pos = [x, y];
    }

    getPos() {
        return this.pos;
    }

    setBoard(board) {
        this.board = board;
    }

    isInBoard() {
        return !(this.board == null || this.posX === null || this.posY === null)
    }

    getParents() {
        if(!this.isInBoard()) {
            return new Array();
        }
        return this.getInDirections()
            .map(processNext(this))
            .filter(dirPipe => dirPipe.children)
    }

    toCodeArg(board) {
        const arg = this.getParents()
            .map((dirPipe) => dirPipe.pipe !== null ? dirPipe.pipe.toCode(dirPipe.dir, board) : null)
        return arg.map(e => e !== null ? e : '?')
    }

    toCode() {
        return `???`;
    }

    getType() {
        return PIPE_TYPES.UNDEFINED;
    }

    isOutDir(dir) {
        return false;
    }

    isInDir(dir) {
        return false;
    }
    
    snapshot() {
        const [x, y] = this.getPos();
        const dir = {}
        this.getAllDirection().forEach((direction) => {
            switch(direction) {
                case DIRECTION.TOP:
                    dir.top = VALUES_TYPES.UNDEFINED;
                    break;
                case DIRECTION.BOTTOM:
                    dir.bottom = VALUES_TYPES.UNDEFINED;
                    break;
                case DIRECTION.RIGHT:
                    dir.right = VALUES_TYPES.UNDEFINED;
                    break;
                case DIRECTION.LEFT:
                    dir.left = VALUES_TYPES.UNDEFINED;
                    break;
            }
        })
        return {
            type: this.getType(),
            pos: { x, y },
            dir,
            errors: this.errors,
            warnings: this.warnings,
        }
    }

}
