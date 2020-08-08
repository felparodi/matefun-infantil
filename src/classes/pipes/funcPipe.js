import { PIPE_TYPES, VALUES_TYPES, METHOD_FUNCTION, DIRECTION } from '../../constants/constants';
import * as messages from '../../constants/messages';
import { matchTypes, isDefined, isGeneric, isList, listGenericSubs, genericReplace} from '../helpers/type';
import { processNext, sortPipe, pipeTypeDefined, pipeDirValueType } from '../helpers/pipe';
import { Pipe } from './pipe'

/*
*   @desc: Retorna la lista de direciones que deberia tener una funcion segun la cantida de tipos de su entrada
*   @attr Arry<ValueType> inType: 
*   @return: Array<Direction>
*/
function inTypesToDirections(inTypes) {
    switch(inTypes.length) {
        case 0: return []
        case 1: return [DIRECTION.TOP]
        case 2: return [DIRECTION.LEFT, DIRECTION.RIGHT]
        case 3: return [DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT]
        default: return []
    }
}

/*
*   @desc: Intenta represantar una funcion de hasta 3 atributos de entrada y un unico tipo de retorno
*   @attr Array<ValueType> inTypes: Tipos Enteradas (deberian ser menos de 3)
*   @attr ValueType outType: String Tipos de salida
*   @attr Array<ValueType> tempInTypes: Represta los tipo de entrada calculados
*   @attr ValueType tempOutType: Representa el tipo de salida calculado
*   @scope: public
*/
export class FuncPipe extends Pipe {

    /*
    *   @desc:
    *   @attr String name:
    *   @attr Array<ValueType> inTypes:
    *   @attr ValueType outType:
    */
    constructor(name, inTypes, outType) {
       super([], [DIRECTION.BOTTOM]);
       this.inTypes = inTypes || [];
       this.outType = outType || VALUES_TYPES.UNDEFINED;
       this.setName(name);
       this.setInDirection(inTypesToDirections(inTypes));
       this.clean();
    }

    /*
    *   @desc: Limpia las variables que se calculan
    *   @return: void
    *   @scope: public
    */
    clean() {
        super.clean();
        this.tempInTypes = [...(this.inTypes)];
        this.tempOutType = this.outType
    }

    /*
    *   @desc:
    *   @attr Direction dir:
    *   @attr ValueType newType:
    *   @return: void
    *   @scope: private
    */
    calcTempTypes(dir, newType) {
        if(isDefined(newType)) {
            const type = this.getDirValueType(dir);
            if(isDefined(type)) {
                if(!matchTypes(type, newType)) {
                    this.addError(messages.NO_MATCH_TYPE);
                }
            } else if(isGeneric(type)) {
                let subsType = newType;
                if(isList(type) && isList(newType)) {
                    subsType = listGenericSubs(type, newType);
                }
                this.tempInTypes = this.tempInTypes
                    .map(genericReplace(subsType));
                this.tempOutType = genericReplace(subsType)(this.tempOutType);
            } else {
                this.setTempDirType(dir, newType);
            }
        }
    }

    /*
    *   @desc:
    *   @attr NextPipe next:
    *   @attr Context context:
    *   @attr IMatrx board:
    *   @attr Direction enterDir:
    *   @attr Array<Pipe> path:
    *   @return: void
    *   @scope: private
    */
    nextPipeCalc(next, context, board, enterDir, path) {
        if (this.errors) { return; }
        if (next.error) { this.addError(next.error); return; }
        if (!next.pipe || !next.connected) { this.addWarning(messages.NO_CONNECTED_DIR(next.dir)); return; }
        //Process next pipe
        const newPath = enterDir ? [...path, this] : [this];
        if (next.dir !== enterDir) next.pipe.calc(context, board, next.inDir, newPath);
        //Setea Valores
        if (pipeTypeDefined(next.pipe)) {
            const nextType = pipeDirValueType(next.pipe, next.inDir);
            this.calcTempTypes(next.dir, nextType);
        }
    }

    /*
    *   @desc: Valida si hay loops, en caso de haberlos agrega un mensaje de error
    *   @attr Array<Pipe> path:
    *   @return: void
    *   @scope: private
    */
    verifyLoop(path) {
        if(path.find((p) => p === this)) {
            const notDummy = path
                .filter((p) => p.getType() !== PIPE_TYPES.DUMMY);
            if(notDummy.length === 1) {
                this.addError(messages.LOOP);
            }
        } 
    }

    /*
    *   @desc:  Calcula si hay loop y los tipos no definidos de la funcion,
    *       ademas calcua de manera recuscibo con la informacion de los Pipe a la que esta conectada
    *   @attr Context context: Context que marca los Pipe que ya se procesaron para que no se generen loops
    *   @attr IMarix board: IMatrix en la que se calcula todo
    *   @attr Direction enterDir?: Direcion desde donde se caclua en caso de ser recuiciba
    *   @attr Array<Pipe> path?: Camino de la recurcion en el calculo
    *   @return: void
    *   @scope: public
    *   @override 
    */
    calc(context, board, enterDir, path=[]) {
        this.verifyLoop(path);
        if(this.errors) { return }
        if(!context.isMark(this.getPos())) {
            context.mark(this.getPos());
            const nextPipes = this.getAllDirections().map(processNext(this, board))
                .sort((n1, n2) => sortPipe(n1.pipe, n2.pipe));
            nextPipes.forEach((next) => this.nextPipeCalc(next, context, board, enterDir, path));
            if (!this.errors && !pipeTypeDefined(this)) {
                context.unMark(this.getPos());
            }
        }
    }

    /*
    *   @desc:  Devulve todas la direciones de una FunacuntionPipe
    *   @return: Array<Direction>
    *   @scope: public
    */
    getAllDirections() {
        return [...(this.getInDirections()), DIRECTION.BOTTOM]
    }

    /*
    *   @desc: Asigana un nombre a la FunctionPipe
    *   @attr String name: Nombre que se desa asignar
    *   @return: void
    *   @scope: private
    */
    setName(name) {
        this.name = name;
    }

    /*
    *   @desc: Devuelve el nombre de la funcion
    *   @return String
    *   @scope: public
    */
    getName() {
        return this.name;
    }

    /*
    *   @desc: Devuevle el codigo que representa la aplicaicon de una funcion con sus hijos como argumentos
    *   @return: String
    *   @scope: public
    *   @override
    */
    toCode() {        
        const arg = this.toCodeArg();
        switch(this.name) {
            case METHOD_FUNCTION.ADD:
                return `(${arg[0]} + ${arg[1]})`;
            case METHOD_FUNCTION.SUB:
                return `(${arg[0]} - ${arg[1]})`;
            case METHOD_FUNCTION.MUL:
                return `(${arg[0]} * ${arg[1]})`;
            case METHOD_FUNCTION.DIV:
                return `(${arg[0]} / ${arg[1]})`;
            case METHOD_FUNCTION.EQUAL:
                return `(${arg[0]} == ${arg[1]})`;
            case METHOD_FUNCTION.N_EQUAL:
                return `(${arg[0]} /= ${arg[1]})`;
            case METHOD_FUNCTION.GREAT:
                return `(${arg[0]} > ${arg[1]})`;
            case METHOD_FUNCTION.E_GREAT:
                return `(${arg[0]} >= ${arg[1]})`;
            case METHOD_FUNCTION.LEST:
                return `(${arg[0]} < ${arg[1]})`;
            case METHOD_FUNCTION.E_LEST:
                return `(${arg[0]} =< ${arg[1]})`;
            case METHOD_FUNCTION.AND:
                return `(${arg[0]} , ${arg[1]})`;
            case METHOD_FUNCTION.EXP:
                return `(${arg[0]} ^ ${arg[1]})`;
            case METHOD_FUNCTION.CONCAT:
                return `${arg[0]} : ${arg[1]}`;
            case METHOD_FUNCTION.POINT:
                return `(${arg[0]}, ${arg[1]})`;
            default:
                return `${this.name}(${arg.join(', ')})`;
        }
    }

    /*
    *   @desc: Seta una ValueType en un los tipos temporales
    *   @attr Direction direction: Direcion en la que se quiere asignar el ValueType
    *   @attr ValueType value: ValueType que se quiere asiganar
    *   @return: void
    *   @scope: private
    */
    setTempDirType(direction, type) {
        if (direction === DIRECTION.BOTTOM) {
            this.tempOutType = type;
        } else {
            const dirPos = this.getInDirections().indexOf(direction);
            if(dirPos >= 0) {
                this.tempInTypes[dirPos] = type;
            }
        }
    }

    /*
    *   @desc: Devuleve las direciones de entrada
    *   @return: Array<Direction>
    *   @scope: public
    *   @override
    */
    getInDirections() {
        return super.getInDirections()
            .filter(d => this.getOriginInType(d));
    }

    /*
    *   @desc: Devuleve el ValueType de una direcion
    *   @attr Direction direction: Direcion de la que se quiere el ValueType
    *   @return: ValueType
    *   @scope: public
    */
    getDirValueType(direction) {
        if (direction === DIRECTION.BOTTOM) {
           return this.tempOutType;
        }
        return this.getInType(direction);
    }

    /*
    *   @desc: Devuleve el ValueType original de una direcion
    *   @attr Direction direction: Direcion de la que se quiere el ValueType
    *   @return: ValueType
    *   @scope: public
    */
    getDirOriginValueType(direction) {
        if (direction === DIRECTION.BOTTOM) {
           return this.outType;
        }
        return this.getOriginInType(direction);
    }

    /*
    *   @desc: Devuleve el ValueType original de una direcion de entada
    *   @attr Direction direction: Direcion de la que se quiere el ValueType
    *   @return: ValueType
    *   @scope: public
    */
    getOriginInType(direction) {
        const dirPos = super.getInDirections().indexOf(direction);
        return dirPos > -1 ? this.inTypes[dirPos] : undefined;
    }

    /*
    *   @desc: Devuleve el ValueType de una direcion de entada
    *   @attr Direction direction: Direcion de la que se quiere el ValueType
    *   @return: ValueType
    *   @scope: public
    */
    getInType(direction) {
        const dirPos = super.getInDirections().indexOf(direction);
        return dirPos > -1 ? this.tempInTypes[dirPos] : undefined;
    }


    /*
    *   @desc: Devuelv el PipeType que repesenta a la FunctionPipe
    *   @return: PipeValue
    *   @scope: public
    *   @overide
    */
    getType() {
        return PIPE_TYPES.FUNCTION;
    }

    /*
    *   @desc: Devuelve si es una direcion de salida valida
    *   @attr Direction dir: Direcion de la que se quiere el saber si es salida
    *   @return: Boolean
    *   @scope: public
    *   @overide
    */
    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM;
    }

    /*
    *   @desc: Devuelve si es una direcion de entrada valida
    *   @attr Direction dir: Direcion de la que se quiere el saber si es entrada
    *   @return: Boolean
    *   @scope: public
    *   @overide
    */
    isInDir(dir) {
        return this.getInDirections().indexOf(dir) >= 0;
    }

    toTree() {
        const args = this.getArgs();
        return { 
            type: 'func', 
            name: this.getName(), 
            args: args.map((pipe) => pipe.toTree())
        }
    }


    /*
    *   @desc: Devulve el SnapPipe que represta a esta FunctionPipe
    *   @return: SnapPipe
    *   @scope: public
    */
    snapshot() {
        return  {
            ...(super.snapshot()),
            name: this.getName(),
            dir: {
                top: this.getDirValueType(DIRECTION.TOP),
                bottom: this.getDirValueType(DIRECTION.BOTTOM),
                right: this.getDirValueType(DIRECTION.RIGHT),
                left: this.getDirValueType(DIRECTION.LEFT)
            },
            originDir: {
                top: this.getDirOriginValueType(DIRECTION.TOP),
                bottom: this.getDirOriginValueType(DIRECTION.BOTTOM),
                right: this.getDirOriginValueType(DIRECTION.RIGHT),
                left: this.getDirOriginValueType(DIRECTION.LEFT)
            }
        }
    }

}