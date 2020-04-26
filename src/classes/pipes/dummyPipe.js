import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import { matchTypes, typeCompare} from '../helpers/type';
import * as messages from '../../constants/messages';
import { sortPipe, pipeTypeDefined, pipeDirValueType, getAllNextPipe } from '../helpers/pipe';
import { Pipe } from './pipe';

/*
*   @desc: Este Pipe represtanta los movimientos de datos y no los tranforma,
*       por lo que tine un solo hijo y muchos padres
*   @attr public Boolean isWorking: Representa si la DummyPipe esta validada para crear direciones para auto unirse con otra en el mismo estado
*   @attr private ValueType tempType: ValueType que se caculo
*   @attr private Direction tempInDirection: Direction de Entrada que se calculo
*   @attr private Array<Direction> tempOutDirs: Las de Direction de salida que se calcularon
*   @scope: public
*/
export class DummyPipe extends Pipe {

    /*
    *   @desc: Constructor crea un DummyPipe con tantas direciones como reciba de argumento
    *   @attr Direction dir1?: Direction a asignar como entrante
    *   @attr Direction dir2?: Direction a asignar como saliente
    *   @attr Direction dir3?: Direction a asignar como saliente
    *   @attr Direction dir4?: Direction a asignar como saliente
    */
    constructor(dir1, dir2, dir3, dir4) {
        super([dir1].filter(d => d), [dir2,dir3,dir4].filter(dir => dir));
        this.clean();
    }

    /*
    *   @desc: Habilia para auto unirse con otras Pipe en estado working 
    *   @return: void
    *   @scope: public
    */
    startWork() {
        this.isWorking = true;
    }

    /*
    *   @desc: Desablita la auto union con Pipe en estado Working
    *   @return: void
    *   @scope: public
    */
    endWork() {
        this.isWorking = false;
    }

    /*
    *   @desc: Agreaga una direcion nueva a el DummyPipe
    *   @attr Direction dir: Direction que se quiere agregar
    *   @return: void
    *   @scope: public
    */
    addDir(dir) {
        const inDir = super.getInDirections();
        const outDir = super.getOutDirections();
        if(inDir.length === 0 && outDir.length === 0) {
            this.setInDirection([dir]);
        } else if(!inDir.find(d => d === dir) && !outDir.find(d => d === dir)) {
            this.setOutDirections([...outDir, dir])
        }
    }

    /*
    *   @desc: Limpia toda la inforamcion que se calcula
    *   @return: void
    *   @scope: public
    *   @override
    */
    clean() {
        super.clean();
        this.tempType = VALUES_TYPES.UNDEFINED;
        this.tempInDirection = undefined;
        this.tempOutDirs = [];
    }

    /*
    *   @desc: Agrega una direcion a las temporales de Salida, 
    *       en caso de que se alla agrado todas menos una a la salida la restante 
    *       se asignara a la direcion de entrada
    *   @attr Direction dirction: Direction que se quiere agregar
    *   @return: void
    *   @scope: private
    */
    addOutTempDir(direction) {
        const allDirections = this.getAllDirection();
        if (allDirections.indexOf(direction) !== -1
            && this.tempOutDirs.indexOf(direction) === -1) {
            this.tempOutDirs.push(direction);
            if((this.tempOutDirs.length + 1) === allDirections.length) {
                this.tempInDirection = allDirections.find((dir) => this.tempOutDirs.indexOf(dir) === -1);
            }
        }
    }

    /*
    *   @desc: Setea la Direcion de tempInDirection de la DummyPipe 
    *      y el resto se en la tempOutDirs
    *   @attr Direction dirction:
    *   @return: void
    *   @scope: private
    */
    addInTempDir(direction) {
        const allDirections = this.getAllDirection();
        if (allDirections.indexOf(direction) !== -1) {
            this.tempInDirection = direction;
            this.tempOutDirs = allDirections.filter((dir) => dir !== direction);
        }
    }

    /*
    *   @desc: Setea el tempType de la DummyPipe
    *   @attr ValueTypes type: ValueType que se desa setear
    *   @return: void
    *   @scope: private
    */
    setTempType(type) {
        if (matchTypes(this.tempType, type)) {
            this.tempType = typeCompare(this.tempType, type);
        } else { 
            this.addError(messages.NO_MATCH_TYPE);
        }
    }

    /*
    *   @desc: Dado una NextPipe calcula si se conecta com tipo entrada o salida 
    *       y en el caso de se asigna a la tempDirection las mismas
    *   @attr NextPipe next: NextPipe que se analiza las direciones
    *   @return: void
    *   @scope: private
    */
    addNextPipeInfoTempDir(next) {
        if (next.pipe.isInDir(next.inDir)) {
            if(this.isInDir(next.dir)) {
                this.addError(messages.LOOP);
            } else {
                this.addOutTempDir(next.dir);
            }
        } else if(next.pipe.isOutDir(next.inDir)) {
            if(this.isOutDir(next.dir)) {
                this.addError(messages.LOOP);
            } else {
                this.addInTempDir(next.dir);
            }
        }
    }

    /*
    *   @desc: Calcula la informacion que se optine de una NextPipe,
    *       a esta en caso de estara conectad se la caclua tambien a la Pipe que contine.
    *       se cacluan las TempDirection y TempType ademas de los mensajes de error y warning
    *   @attr NextPipe next: NextPipe de la que se optine la informacion
    *   @attr Context context: Contexto de el calc que se tiene hasta el momento
    *   @attr IMatrix board: IMatrix en donde se calcula todo
    *   @attr Direction enterDir: Direcion de de el calc que se esta realizando
    *   @attr Array<Pipe> path: Pips por las que se paso antes de cacular esta DummyPipe
    *   @return: void
    *   @scope: private
    */
    nextPipeCalc(next, context, board, enterDir, path=[]) {
        if(this.errors) { return; }
        if(next.error) { this.addError(next.error); return; }
        if(!next.pipe || !next.connected) { this.addWarning(messages.NO_CONNECTED_DIR(next.dir)); return; }
        const newPath = enterDir ? [...path, this] : [this];
        if(next.dir !== enterDir) { next.pipe.calc(context, board, next.dir, newPath); }
        this.addNextPipeInfoTempDir(next);
        if(this.errors) { return; }
        const type = pipeDirValueType(next.pipe, next.inDir);
        this.setTempType(type)
    }

    /*
    *   @desc: Calcula la informacion del estado de la DummyPipe en un IMatrix
    *        y de sus Pipe que estan conectadas
    *   @attr Context context: Context donde se marcan los Pipe ya caclulados
    *   @attr IMatrix board: IMatiz donde se calculan
    *   @attr Direction direction?: Direcion desde donde se calcula
    *   @attr Array<Pipe> path?: Los pipe que se cacluaron para llegar a este
    *   @return: void
    *   @scope: public
    *   @overider
    */
    calc(context, board, enterDir, path=[]) {
        if(!context.isMark(this.getPos())) {
            context.mark(this.getPos());
            const nextPipes = getAllNextPipe(this)
                .sort((n1, n2) => sortPipe(n1.pipe, n2.pipe));
            nextPipes
                .forEach(next => this.nextPipeCalc(next, context, board, enterDir, path))
            if(!this.errors && !pipeTypeDefined(this)) {
                context.unMark(this.getPos());
            }       
        }
    }

    /*
    *   @desc: Devuelve el codigo de el hijo del DummyPipe
    *   @return: String
    *   @scope: public
    *   @overider
    */
    toCode() {
        return this.toCodeArg().join(', ');
    }

    /*
    *   @desc: Devuelve el PipeType que representa el dummyPipe
    *   @return: PipeType
    *   @scope: public
    *   @overider
    */
    getType() {
        return PIPE_TYPES.DUMMY;
    }

    /*
    *   @desc: Devulve el ValueType que se conestan con el dummyPipe
    *   @return: ValueType
    *   @scope: public
    */
    getValueType() {
        return this.tempType;
    }

    /*
    *   @desc: Devuelve si la direcion es de tipo entrada
    *   @attr Direction dir: Direction que se quiere evaluar
    *   @return: Boolean
    *   @scope: public
    *   @overider
    */
    isInDir(dir) {
        return this.tempInDirection === dir;
    }

    /*
    *   @desc: Devuelve si la direcion es de tipo salida
    *   @attr Direction dir: Direction que se quiere evaluar
    *   @return: Boolean
    *   @scope: public
    *   @overider
    */
    isOutDir(dir) {
        return this.tempOutDirs.indexOf(dir) !== -1;
    }

    /*
    *   @desc: Obtine todas la direciones de entrada de la DummyPipe
    *   @return: Array<Direction>
    *   @scope: public
    *   @overider
    */
    getInDirections() {
        return this.tempInDirection ? [this.tempInDirection] : []
    }

    /*
    *   @desc: Obtine todas la direciones de salida de la DummyPipe
    *   @return: Array<Direction>
    *   @scope: public
    *   @overider
    */
    getOutDirections() {
        return this.tempOutDirs;
    }

    /*
    *   @desc: Devulve el DirectionType que coresponde al su SnapPipe 
    *   @return: DirectionType
    *   @scope: private
    */
    getDirectionType() {
        const valueType = this.getValueType();
        const dir = {};
        this.getAllDirection().forEach((direction) => {
            switch(direction) {
                case DIRECTION.TOP:
                    dir.top = valueType;
                    break;
                case DIRECTION.BOTTOM:
                    dir.bottom = valueType;
                    break;
                case DIRECTION.RIGHT:
                    dir.right = valueType;
                    break;
                case DIRECTION.LEFT:
                    dir.left = valueType;
                    break;
            }
        });
        return dir;
    }

    /*
    *   @desc: Devulve una esturctura que represeta la informacion de la DummyPipe
    *   @return: SnapPipe
    *   @scope: public
    *   @overider
    */
    snapshot() {
        const dir = this.getDirectionType();
        return {
            ...(super.snapshot()),
           dir,
           isWorking: this.isWorking,
        }
    }
}