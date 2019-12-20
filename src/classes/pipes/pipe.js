import { DIRECTION, PIPE_TYPES, ERROR } from '../../constants/constants';

export function processNext(pipe) {
    return (direction) => {
        let before = null;
        let nextDir = null;
        switch(direction) {
            case DIRECTION.BOTTOM:
                nextDir = DIRECTION.TOP;
                before = pipe.board.value(pipe.posX + 1, pipe.posY);
                break;
            case DIRECTION.TOP: 
                nextDir = DIRECTION.BOTTOM;
                before = pipe.board.value(pipe.posX - 1, pipe.posY);
                break;
            case DIRECTION.RIGHT:
                nextDir = DIRECTION.LEFT;
                before = pipe.board.value(pipe.posX, pipe.posY + 1);
                break;
            case DIRECTION.LEFT:
                nextDir = DIRECTION.RIGHT;
                before = pipe.board.value(pipe.posX, pipe.posY - 1);
                break;
        }
        before = before !== null && before.isOutDirection(nextDir) ? before : null;
        return { pipe: before, dir: direction, nextDir: nextDir};
    }
}

export class Pipe {

    constructor(inDirections, outDirections) {
        this.setInDirection(inDirections);
        this.setOutDirections(outDirections); 
        this.board = null;
        this.posX = null;
        this.posY = null;
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

    setBoard(board) {
        this.board = board;
    }

    getParents(outDirections) {
        //console.log('getParents.this', this);
        if(this.board == null || this.posX === null || this.posY === null) {
            return new Array();
        }
        //console.log('getParents.getInDirections', this.getInDirections());
        return this.getInDirections().map(processNext(this));
        //console.log('getParents.parents', parents);
        //return parents.filter(parent => parent.pipe !== null && parent.pipe !== undefined);
    }

    getChildrens() {
        if(this.board == null || this.posX === null || this.posY === null) {
            return new Array();
        }
        return this.getOutDirections().map((direction) => {
            let after = null;
            switch(direction) {
                case DIRECTION.BOTTOM:
                    after = this.board.value(this.posX + 1, this.posY);
                case DIRECTION.TOP: 
                    after = this.board.value(this.posX + 1, this.posY);
                case DIRECTION.RIGHT:
                    after = this.board.value(this.posX + 1, this.posY);
                case DIRECTION.LEFT:
                    after = this.board.value(this.posX + 1, this.posY);
            }
            after = after !== null && after.isOutDirection(direction) ? after : null;
            return { pipe: after, dir: direction };
        });
        //return childrens.filter(children => children !== null && children !== undefined);
    }

    toCodeArg(direction, blockVars) {
        const arg = this.getParents(direction).map(p => p.pipe !== null ? p.pipe.toCode(p.nextDir, blockVars) : null)
        return arg.map(e => e !== null ? e : '?').join(', ')
    }

    toCode() {
        return `(???)`;
    }

    getType() {
        return PIPE_TYPES.UNDEFINED;
    }

    getStatus() {

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