import { PIPE_TYPES } from '../constants/constants';

export class MatrixPipe {

    constructor(x, y) {
        this.maxX = x;
        this.maxY = y;
        this.clean();
    }

    getAllPipes() {
        const pipes = new Array();
        for(let i = 0; i < this.maxX; i++) {
            for(let j = 0; j < this.maxY; j++) {
                const pipe = this.value(i,j);
                if (pipe !== null && pipe !== undefined) {
                    pipes.push(pipe);
                }
            }
        }
        return pipes;
    }

    getEndPipes() {
        return this.getAllPipes()
            .filter(pipe => pipe.getType() === PIPE_TYPES.END);
    }

    clean() {
        this.values = new Array();
        this.ends = new Array();
        for(let i = 0; i < this.maxX; i++) {
            const column = new Array();
            for(let j = 0; j < this.maxY; j++) {
                column.push(null);
            }
            this.values.push(column);
        }
    }

    value(x, y) {
        return this.values[x][y];
    }

    size() {
        return [this.maxX, this.maxY];
    }

    isValidRange(x, y) {
        return x < 0 || x >= this.maxX || y < 0 || y >= this.maxY
    }

    validateRange(x, y) {
        if (this.isValidRange(x,y)) {
            throw new Error("Out of range")
        }
    }
    validateAddPipe(x, y, p) {
        this.validateRange(x, y)
        //@TODO Ver que el tubo puede ser agregado
    }

    addPipe(x, y, p) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") } 
        this.values[x][y] = p;
        p.setBoard(this);
        p.setPos(x, y);
    }

    removePipe(x, y) {
        //@TODO Remove to ends list in case to remove pipe is end pipe
        this.values[x][y] = null
    }

    processFunction(x, y) {
        let p = null
        if (x !== undefined && y !== undefined) {
            p = this.value(x, y);
        } else {
            const ends = this.getEndPipes();
            p = ends.length > 0 ? ends[0] : null;
        }
        if (p === null) {
            throw 'Not Have valid init cell to process';
        }
        return p.toCode()
    }

    hasErrors() {
       return this.getAllPipes()
            .map(pipe => pipe.getError())
            .filter(error => error !== null);
    }

    clone() {
        const m = new MatrixPipe(this.maxX, this.maxY);
        for(let x = 0; x < this.maxX; x++) {
            for(let y = 0; y < this.maxY; y++) {
                const pipe = this.value(x,y);
                if (pipe !== null) {
                    m.addPipe(x, y, pipe.clone());
                }
            }
        }
        return m;
    }

    validateMatrix() {

    }
}