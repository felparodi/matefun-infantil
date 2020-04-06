import {PIPE_TYPES} from '../constants/constants';
import { invertDirection } from './helpers/direction';
import { Context } from './context';

/*
*   @desc: Devulve si dos Positions son iguales
*   @attr Position pos1: Una de las posiciones que se desea comparar
*   @attr Position pos2: Una de las posiciones que se desea comparar
*   @return: Boolean
*   @scope: public
*/
export function equalPos(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

/*
*   @desc: Clase que ese utliza para encotra caminos validos en una matriz
*   @attr Array<[Position, Array<Position>]> peandinProces: Donde se guardan las posiciones pendientes
*         de procesar y el camino que nos llevo a ella
*   @attr MatrixPipe matrix: Matriz que se esta analizando
*   @attr Position end: Posicion a la que se quiere llegar
*   @attr Context context: Donde se marcan las posiciones ya visitadas
*   @scope: public
*/
export class BFS {

    /*
    *   @desc: Constructo de la clase, setea una de la primera poscione en la lista de pendietes
    *       y la otra como final, ademas de la Matriz que se desea evaluar
    *   @attr Position pos1: Posicion Inicial
    *   @attr Position pos2: Posicion final
    *   @attr IMarixPipe matrix: Matrix que se desa evaluar  
    */
    constructor(pos1, pos2, matrix) {
        this.peandinProces = [[pos1, []]];
        this.matrix = matrix;
        this.end = pos2;
        this.context = new Context(matrix.maxX, matrix.maxY);
    }

    /*
    *   @desc: En caso que encuentre devuevle la una lista de posiciones que representan el camino
    *   @return: Array<Position>
    *   @scope: public
    */
    procces() {
        if(this.peandinProces.length === 0) return null;
        const [actual, path] = this.peandinProces.shift();
        if(equalPos(actual, this.end)) { 
            return [...path, actual];
        }
        const arround = this.matrix.getAroundPos(actual);
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