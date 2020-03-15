import {PIPE_TYPES} from '../constants/constants';
import { invertDirection } from './helpers/direction';
import { Context } from './context';

function equalPos(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}
export class BFS {
    constructor(pos1, pos2, matrix) {
        this.peandinProces = [[pos1, []]];
        this.matrix = matrix;
        this.end = pos2;
        this.context = new Context(matrix.maxX, matrix.maxY);
    }

    procces() {
        if(this.peandinProces.length === 0) return null;
        const [actual, path] = this.peandinProces.shift();
        if(equalPos(actual, this.end)) { 
            return [...path, actual];
        }
        const arround = this.matrix.getArroundPos(actual);
        const childer = arround
            .filter(pos => !this.context.isMark(pos))
            .filter(pos => {
                const pipe = this.matrix.value(pos.x, pos.y);
                return !pipe || 
                    (pipe.getType() === PIPE_TYPES.DUMMY &&
                    pipe.hasDirection(invertDirection(pos.dir)));
            });
        for (let i = 0; i < childer.length; i++) {
            const p = childer[i];
            this.peandinProces.push([p, [...path, actual]]);
            this.context.mark(p);
        }
        return this.procces();
    }
}