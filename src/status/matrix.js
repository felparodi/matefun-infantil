import {Pipe, DUMMY, END} from './pipe';
import {DummyPipe} from './dummyPipe';

export class MatrixPipe {

    constructor(x, y) {
        this.maxX = x;
        this.maxY = y;
        this.clean();
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
        if (p.getType() === END) {
            this.ends.push([x,y])
        }
        this.values[x][y] = p;
        p.setBoard(this);
        p.setPos(x, y);
    }

    removePipe(x, y) {
        //@TODO Remove to ends list in case to remove pipe is end pipe
        this.values[x][y] = null
    }

    processFunction(x, y) {
        if (!x && !y && this.ends.length  > 0) {
            [x, y] = this.ends[0]
        }
        const p = this.value(x, y)
        return p.toString()
    }

}