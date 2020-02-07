import { DIRECTION, PIPE_TYPES, ERROR } from '../../constants/constants';

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
        let before = pipe.board.value(x, y);
        let nextDir = invertDirection(direction);
        const connected = before !== null ?  before.hasDirection(nextDir) : true;
        const children = before !== null ?  before.isOutDirection(nextDir) : true;
        return { pipe: before, dir: direction, connected, children };
    }
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

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
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
}