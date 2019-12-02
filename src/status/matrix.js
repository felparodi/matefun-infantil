import {Pipe, DUMMY, END} from './pipe';
import {DummyPipe} from './dummyPipe';
export const UP = 'U';
export const DOWN = 'D';
export const LEFT = 'L';
export const RIGHT = 'R';
export const PENDING = 'P';

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
        if (this.value(x,y) != null) { throw new Error("Exist pipe in this position") }
        if (p.getType() === END) {
            this.ends.push([x,y])
        }
        this.values[x][y] = p;
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

    static afterPos(x, y, dir) {
        const ret = new Array()
        if (dir.indexOf(UP) !== -1) ret.push([x - 1, y]);
        if (dir.indexOf(DOWN) !== -1) ret.push([x + 1, y]);
        if (dir.indexOf(RIGHT) !== -1) ret.push([x , y + 1]);
        if (dir.indexOf(LEFT) !== -1) ret.push([x, y - 1]);
        return ret
    }

    static invDir(dir) {
        switch(dir) {
            case UP: return DOWN;
            case DOWN: return UP;
            case RIGHT: return LEFT;
            case LEFT: return RIGHT;
            default: return PENDING;
        }
    }

    //Return array of direction to go for posI to posO
    //@TODO find more complex path
    findPath(xi, yi, xo, yo) {
        const ret = new Array();
        if (xi + 1 === xo && yi === yo) ret.push(DOWN);
        if (xi - 1 === xo && yi === yo) ret.push(UP);
        if (xi === xo && yi - 1 === yo) ret.push(LEFT);
        if (xi === xo && yi + 1 === yo ) ret.push(RIGHT);
        return ret;
    }

    //@TODO implement
    cleanPath(x, y, path) {

    }

    //HAy que ver que si es funcion depende de como de donde se quiere hacer el join
    join(x0, y0, out, dir) {
        //@TODO Validadar camino libre
        const [[x1, y1]] = MatrixPipe.afterPos(x0, y0, dir)
        const p0 = this.value(x0, y0);
        const p1 = this.value(x1, y1);
        if (p0 === null || p1 === null) { throw new Error("Can't join not exist Pipe"); }
        const pi = out ? p0 : p1;
        const po = out ? p1 : p0; 
        if (!po.matchToIn(pi)) { throw new Error("Not Match Pipe Type"); }
        //@TODO Create all dummy conecction in the clean path
        po.joinIn(pi)
        //pi.addOutDir(path[0])
        //this.createDummyPath(pi, xi, yi, path)
        //po.addInDir(MatrixPipe.invDir(path[path.length-1]))
    }

    createDummyPath(pi, x0, y0, path) {
        let [x, y] = [x0, y0];
        for(let i = 1; i < path.length-1; i++) {
            const pd = new DummyPipe();
            pd.setInType(pi.getOutType());
            [[x, y]] = MatrixPipe.afterPos(x, y, [path[i]])
            this.addPipe(x, y, pd)
        }
    }
}