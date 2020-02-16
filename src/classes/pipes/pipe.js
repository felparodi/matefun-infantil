import { DIRECTION, PIPE_TYPES, ERROR, VALUES_TYPES } from '../../constants/constants';

export function isMarked(context, pipe) {
    return context.marks[pipe.getPosX()][pipe.getPosY()];
}

export function matchTypes(type1, type2) {
    const {UNDEFINED} = VALUES_TYPES;
    return type1 === UNDEFINED || type2 === UNDEFINED || type1 === type2;
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
        const [x, y] = directionMove(pipe.posX, pipe.posY, direction);
        if (!pipe.board) { return null; }
        let before = pipe.board.value(x, y);
        let nextDir = invertDirection(direction);
        const connected = before ?  before.hasDirection(nextDir) : true;
        const children = before ?  before.isOutDirection(nextDir) : true;
        return { pipe: before, dir: direction, connected, children };
    }
}

export function validateOutType(outType, next) {
    if (next.pipe.getInType) {
        const type = next.pipe.getInType(invertDirection(next.dir));
        if (type) {
            if (!matchTypes(outType, type)) {
                return { valid: false, error: 'Tipos no conciden', type }
            } 
            return { valid: true, type }
        }
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

    getChildrens() {
        if(!this.isInBoard()) {
            return new Array();
        }
        return this.getOutDirections()
            .map(processNext(this))
            .filter(dirPipe => !dirPipe.children)
    }

    toCodeArg() {
        const arg = this.getParents()
            .map((dirPipe) => dirPipe.pipe !== null ? dirPipe.pipe.toCode(dirPipe.dir) : null)
        return arg.map(e => e !== null ? e : '?').join(', ')
    }

    toCode() {
        return `(???)`;
    }

    getType() {
        return PIPE_TYPES.UNDEFINED;
    }

    hasError() {
        return false;
    }

    isOutDirection(direction) {
        return this.getOutDirections().indexOf(direction) >= 0;
    }

    isInDirection(direction) {
        return this.getInDirections().indexOf(direction) >= 0;
    }

    getError() {
        const parents = this.getParents();
        for(let i = 0; i < parents.length; i++) {
            const parent = parents[i];
            if(parent.pipe === null) {
                return { pipe: this, type: ERROR.CODE.MISSING_PARENT }
            }
        }
        return null;
    }

    getErrorFlow() {
        let error = this.getError();
        if (error !== null) { return error }
        const parents = this.getParents();
        for(let i = 0; i < parents.length; i++) {
            let error = parent.pipe.getErrorFlow(parent.dir);
            if (error != null) {
                return error;
            }
        }
        return null;
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
