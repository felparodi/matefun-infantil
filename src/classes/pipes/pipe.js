import { DIRECTION, PIPE_TYPES, ERROR, VALUES_TYPES } from '../../constants/constants';
import { processNext } from '../helpers/pipe';

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
        this.setOutDirections(outDirections.filter(d => d)); 
        this.board = null;
        this.pos = null;
    }

    getBoard() {
        return this.board;
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
        this.inDirections = Array.isArray(inDirections) ? inDirections.filter(d => !!d) : inDirections ? [ inDirections ] : new Array();
    }

    setOutDirections(outDirections) {
        this.outDirections = Array.isArray(outDirections) ? outDirections.filter(d => !!d) : outDirections ? [ outDirections ] : new Array();
    }

    getInDirections() {
        return this.inDirections;
    }

    getOutDirections() {
        return this.outDirections;
    }

    setPos(x, y) {
        this.pos = {x, y};
    }

    getPos() {
        return this.pos;
    }

    setBoard(board) {
        this.board = board;
    }

    isInBoard() {
        return !(this.board == null || this.pos === null)
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
        const parentPipe = this.getParents();
        const arg = parentPipe
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
        const pos = this.getPos();
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
            pos,
            dir,
            errors: this.errors,
            warnings: this.warnings,
        }
    }

}
