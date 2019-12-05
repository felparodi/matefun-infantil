import { DIRECTION, PIPE_TYPES } from '../../constants/constants';
export class Pipe {

    constructor(inDirections, outDirections) {
        this.setInDirection(inDirections);
        this.setOutDirections(outDirections); 
        this.board = null;
        this.posX = null;
        this.posY = null;
    }

    setInDirection(inDirections) {
        this.inDirections = Array.isArray(inDirections) ? inDirections : new Array();
    }

    setOutDirections(outDirections) {
        this.outDirections = Array.isArray(outDirections) ? outDirections : new Array();
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

    getParents() {
        //console.log('getParents.this', this);
        if(this.board == null || this.posX === null || this.posY === null) {
            return new Array();
        }
        //console.log('getParents.getInDirections', this.getInDirections());
        const parents = this.getInDirections().map((direction) => {
            let before = null;
            switch(direction) {
                case DIRECTION.BOTTOM:
                    return this.board.value(this.posX + 1, this.posY);
                case DIRECTION.TOP: 
                    return this.board.value(this.posX - 1, this.posY);
                case DIRECTION.RIGHT:
                    return this.board.value(this.posX, this.posY + 1);
                case DIRECTION.LEFT:
                    return this.board.value(this.posX, this.posY - 1);
            }
        });
        //console.log('getParents.parents', parents);
        return parents.filter(parent => parent !== null && parent !== undefined);
    }

    getChildrens() {
        if(this.board == null || this.posX === null || this.posY === null) {
            return new Array();
        }
        const childrens = this.inDirections.map((direction) => {
            let before = null;
            switch(direction) {
                case DIRECTION.BOTTOM:
                    return this.board.value(this.posX + 1, this.posY);
                case DIRECTION.TOP: 
                    return this.board.value(this.posX + 1, this.posY);
                case DIRECTION.RIGHT:
                    return this.board.value(this.posX + 1, this.posY);
                case DIRECTION.LEFT:
                    return this.board.value(this.posX + 1, this.posY);
            }
        });
        return childrens.filter(parent => parent !== null && parent !== undefined);
    }

    toStringArg() {
        const arg = this.getParents().map(p => p.toString())
        return arg.map(e => e !== null ? e : '?').join(', ')
    }

    toString() {
        return `(???)`;
    }

    getType() {
        return PIPE_TYPES.UNDEFINED;
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    }
}