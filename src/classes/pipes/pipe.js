import { DIRECTION, PIPE_TYPES, ERROR, VALUES_TYPES } from '../../constants/constants';
import { getNextChildren } from '../helpers/pipe';

/*
*   @desc: Esta clase es la base de la es de la estructura de 
*       nodos que represtenta el grafo de una funcion
*   @attr private Position pos: Position donde se encuera el Pipe en la IMatrix
*   @attr private IMatrix board: IMatrix a la que pertence un Pipe 
*   @attr private Array<Direction> inDirections: Direciones entranres a un Pipe, childrens
*   @attr private Array<Direction> outDirections: Direciones salientes a un Pipe, childrens
*   @attr protected Array<String> error: Los error que se encotraron mientrs se calculaba la informcion
*   @attr protected Array<String> warning: Los warning que se encontraron mientras se calculava una direcion
*   @scope: public
*   @abstract
*   @implement IPipe
*/
export class Pipe {

    /*
    *   @desc: Constructor de la clase, donde se seatean las direciones de entrada y 
    *       salida del grafo
    *   @attr Array<Direction> inDirection:
    *   @attr Array<Direction> outDirection:
    *   @scope: protected
    */
    constructor(inDirections, outDirections) {
        this.setInDirection(inDirections.filter(d => d));
        this.setOutDirections(outDirections.filter(d => d)); 
        this.board = null;
        this.pos = null;
    }

    /*
    *   @desc: Devuelve la IMatrix asignada al Pipe
    *   @return: IMatrix
    *   @scope: public
    */
    getBoard() {
        return this.board;
    }

    /*
    *   @desc: Limpia todos los valores que se setean en una corrida de calcular
    *   @return: void
    *   @scope: public
    */
    clean() {
        this.warnings = undefined;
        this.errors = undefined;
    }

    /*
    *   @desc: Calcula informacion de los Pipe que depende de como se conectan con los otros en la IMatrix
    *   @attr Context context: Context que marca los Pipe que ya se procesaron para que no se generen loops
    *   @attr IMarix board: IMatrix en la que se calcula todo
    *   @attr Direction enterDir?: Direcion desde donde se caclua en caso de ser recuiciba
    *   @attr Array<Pipe> path?: Camino de la recurcion en el calculo
    *   @return: void
    *   @scope: public
    */
   calc(context, board, enterDir, path=[]) {
        context.mark(this.pos);
    }

    /*
    *   @desc: Agrega un mensage error a la lista de errores, en caso de no haber lista la crea
    *   @attr String e: Mensagje que se agrega
    *   @return: void
    *   @scope: public
    */
    addError(e) {
        if (!this.errors) this.errors = [];
        this.errors.push(e); 
    }

    /*
    *   @desc: Agrega un mesnsage de warning a la lista de warnings
    *   @attr String e: 
    *   @return: void
    *   @scope: public
    */
    addWarning(e) {
        if (!this.warnings) this.warnings = [];
        this.warnings.push(e); 
    }


    /*
    *   @desc: Devuelve la list de direciones que contien un Pipe
    *   @return: Array<Direction>
    *   @scope: public
    */
    getAllDirection() {
        const setDir = new Set()
        this.inDirections.forEach((value) => setDir.add(value))
        this.outDirections.forEach((value) => setDir.add(value))
        const directionList = new Array()
        setDir.forEach((value) => directionList.push(value))
        return directionList;
    }

    
    /*
    *   @desc: Devuelve si un Pipe contiene una Direction en particular
    *   @attr Directin dir: Direction que se quiere saber si esta contenida
    *   @return: Boolean
    *   @scope: public
    */
    hasDirection(dir) {
        return this.getAllDirection().indexOf(dir) >= 0;
    }


    /*
    *   @desc: Set la lista de direciones entrantes a una tuberia, childres
    *   @attr Array<Direction> | Direction inDirections: Direction o Array<Direction> que se desa asignar
    *   @return: void
    *   @scope: public
    */
    setInDirection(inDirections) {
        this.inDirections = Array.isArray(inDirections) ? inDirections.filter(d => !!d) : inDirections ? [ inDirections ] : new Array();
    }

    /*
    *   @desc: Set la lista de direccione saliente de una tuberia, parents
    *   @attr Array<Direction> | Direction e:
    *   @return: void
    *   @scope: public
    */
    setOutDirections(outDirections) {
        this.outDirections = Array.isArray(outDirections) ? outDirections.filter(d => !!d) : outDirections ? [ outDirections ] : new Array();
    }

    /*
    *   @desc: Devuelve la lista de direciones entrantes
    *   @return: Array<Direction> 
    *   @scope: public
    */
    getInDirections() {
        return this.inDirections;
    }

    /*
    *   @desc: Devuelve la lista de direciones salientes
    *   @return: Array<Direction> 
    *   @scope: public
    */
    getOutDirections() {
        return this.outDirections;
    }

    /*
    *   @desc: Devuelve toda la lista de direciones
    *   @return: Array<Direction> 
    *   @scope: public
    */
    getAllDirections() {
        return [...this.inDirections, ...this.outDirections];
    }

    /*
    *   @desc: Setea la Position de un Pipe
    *   @attr Int x: Valore en el eje X de la Position
    *   @attr Int y: Valore en el eje Y de la Position
    *   @return: void
    *   @scope: public
    */
    setPos(x, y) {
        this.pos = {x, y};
    }

    /*
    *   @desc: Devuelve la Position de un Pipe
    *   @return: Position
    *   @scope: public
    */
    getPos() {
        return this.pos;
    }

    /*
    *   @desc: Set la IMatrix que represta la en la que esta el Pipe
    *   @attr IMatrix board: IMatrix que se quiere asignar
    *   @return: void
    *   @scope: public
    */
    setBoard(board) {
        this.board = board;
    }

    /*
    *   @desc: Devuelve si la Pipe pertence a alguna matriz
    *   @return: Boolean
    *   @scope: public
    */
    isInBoard() {
        return !(this.board == null || this.pos === null)
    }

    /*
    *   @desc: Devuelve la lista de las NextPipe que represtan a los hijos de la misma
    *   @return: Array<NextPipe>
    *   @scope: private
    */
    getChildrens() {
        if(!this.isInBoard()) {
            return new Array();
        }
        return getNextChildren(this)
            .filter(dirPipe => dirPipe.children)
    }

    /*
    *   @desc: Devulve la lista de los codigos de los childres de una Pipe
    *   @return: Array<String>
    *   @scope: protected
    *   @TODO como se accede al board
    */
    toCodeArg() {
        const parentPipe = this.getChildrens();
        const arg = parentPipe
            .map((dirPipe) => dirPipe.pipe !== null ? dirPipe.pipe.toCode() : null)
        return arg.map(e => e !== null ? e : '?')
    }

    /*
    *   @desc: Codigo que represtna un tuberia y sus childrens
    *   @return: String
    *   @scope: public
    */
    toCode() {
        return `???`;
    }

    /*
    *   @desc: Devuvle el PipeType de una Pipe
    *   @return: PipeType
    *   @scope: public
    */
    getType() {
        return PIPE_TYPES.UNDEFINED;
    }

    /*
    *   @desc: Devuelve si una direccione es de salida
    *   @attr Direction dir: Direcion a evaluar
    *   @return: Boolean
    *   @scope: public
    */
    isOutDir(dir) {
        return false;
    }

    /*
    *   @desc: Devuelve si una direccione es de entrada
    *   @attr Direction dir: Direcion a evaluar
    *   @return: Boolean
    *   @scope: public
    */
    isInDir(dir) {
        return false;
    }
    
    /*
    *   @desc: Devuelve una estructura de datos que representa la informacion del la Pipe
    *   @return: SnapPipe
    *   @scope: public 
    */
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
