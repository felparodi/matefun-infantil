/*
*   @desc: Clase que se utiliza para saber que posiciones de una matriz estan marcadas
*   @attr Array<Array<Boolean>> marks: Donde se guardan las posiciones si estan o no marcadas
*   @attr Int index: Contador de indices para las varibles
*   @scope: public
*/
export class Context {

    /*
    *   @desc: Constructor de la clase, incializa con las marcas en false
    *   @attr Int maxX: Tamnio maximo en el eje X
    *   @attr Int maxY: Tamnio maximo en el eje Y
    *   @scope: public
    */
    constructor(maxX, maxY) {
        this.marks = Array(maxX).fill([]).map(() => Array(maxY).fill(false));
        this.index = 0;
    }

    /*
    *   @desc: Devuelve si una posicion esta marcada o no
    *   @attr Position pos: Posicion que se desea evaluar
    *   @return: Boolean
    *   @scope: public
    */
    isMark(pos) {
        const {x, y} = pos;
        return this.marks[x][y];
    }

    /*
    *   @desc: Marca la poscion
    *   @attr Position pos: Indica la posicion que se desea marcar
    *   @return: void
    *   @scope: public
    */
    mark(pos) {
        const {x, y} = pos;
        this.marks[x][y] = true;
    }


    /*
    *   @desc: Desmarca la poscion
    *   @attr Position pos: Indica la posicion que se desea desmarcar
    *   @return: void
    *   @scope: public
    */
    unMark(pos) {
        const {x, y} = pos;
        this.marks[x][y] = false;
    }

    /*
    *   @desc: Devuelve un indice disponible
    *   @return: Int
    *   @scope: public
    */
    getIndex() {
        return this.index++;
    }
}