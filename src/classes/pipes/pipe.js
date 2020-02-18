import { DIRECTION, PIPE_TYPES, ERROR, VALUES_TYPES } from '../../constants/constants';

export function isMarked(context, pipe) {
    return context.marks[pipe.getPosX()][pipe.getPosY()];
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

export function directionMove(x, y, direction) {
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

export function sortPipe(p1, p2) {
    if(p1 && p2) {
        const t1 = p1.getType();
        const t2 = p2.getType();
        if(t1 === t2) return 0;
        if(t1 === PIPE_TYPES.VALUE) return -1;
        if(t2 === PIPE_TYPES.VALUE) return 1;
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
        try {
            const [x, y] = directionMove(pipe.posX, pipe.posY, direction);
            if (!pipe.board) { return null; }
            let next = pipe.board.value(x, y);
            let nextDir = invertDirection(direction);
            const connected = next ?  next.hasDirection(nextDir) : true;
            const children = next ?  next.isOutDirection(nextDir) : true;
            return { pipe: next, dir: direction, connected, children };
        } catch(e) {
            return { error: e.message, dir: direction };
        }
    }
}

export function typeCompare(t1, t2) {
    if(isDefined(t1)) { return t1; }
    if(isDefined(t2)) { return t2; }
    if(isGeneric(t1)) { return t1; }
    if(isGeneric(t2)) { return t2; }
    return VALUES_TYPES.UNDEFINED;
}

export function validateDirType(pipe, next) {
    const nextInvDir = invertDirection(next.dir);
    const nextType = next.pipe.getDirType(nextInvDir);
    if (nextType) {
        const pipeDirType = pipe.getDirType(next.dir);
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
        this.posX = null;
        this.posY = null;
    }

    clean() {
        this.warnings = undefined;
        this.errors = undefined;
    }

    calc(context, board) {
        context.marks[this.posX][this.posY] = true;
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
        this.posX = x;
        this.posY = y;
    }

    getPosX(){
        return this.posX;
    }

    getPosY(){
        return this.posY;
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

    toCodeArg() {
        const arg = this.getParents()
            .map((dirPipe) => dirPipe.pipe !== null ? dirPipe.pipe.toCode(dirPipe.dir) : null)
        return arg.map(e => e !== null ? e : '?').join(', ')
    }

    toCode() {
        return `???`;
    }

    getType() {
        return PIPE_TYPES.UNDEFINED;
    }

    isOutDirection(direction) {
        return this.getOutDirections().indexOf(direction) >= 0;
    }

    isOutDir(dir) {
        return false;
    }

    isInDir(dir) {
        return false;
    }

    setDirType(direction, type) {

    }

    getDirType(direction) {
        return VALUES_TYPES.UNDEFINED;
    }
    
    snapshot() {
        return {
            type: this.getType(),
            posX: this.getPosX(),
            posY: this.getPosY(),
            inDirections: this.getInDirections(),
            outDirections: this.getOutDirections(),
            errors: this.errors,
            warnings: this.warnings,
        }
    }

}
