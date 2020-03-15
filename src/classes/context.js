export class Context {
    constructor(maxX, maxY) {
        this.marks = Array(maxX).fill([]).map(() => Array(maxY).fill(false));
        this.index = 0;
    }

    isMark(pos) {
        const {x, y} = pos;
        return this.marks[x][y];
    }

    mark(pos) {
        const {x, y} = pos;
        this.marks[x][y] = true;
    }

    unMark(pos) {
        const {x, y} = pos;
        this.marks[x][y] = false;
    }

    getIndex() {
        return this.index++;
    }
}