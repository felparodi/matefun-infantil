import { PIPE_TYPES, VALUES_TYPES, METHOD_FUNCTION, DIRECTION } from '../../constants/constants';
import { invertDirection } from '../helpers/direction';
import { matchTypes, isDefined, isGeneric, pipeDirValueType, pipeTypeDefined } from '../helpers/type';
import { processNext, sortPipe } from '../helpers/pipe';
import { Pipe } from './pipe'

/*
* Retorna la lista de direciones que deberia tener una funcion segun la cantida de tipos de su entrada
* Param: 
* - inType: List<String>
* Out: List<String>
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
* Intenta represantar una funcion de hasta 3 atributos de entrada y un unico tipo de retorno
* Attr
* - inTypes:List<String> Tipos Enteradas (deberian ser menos de 3)
* - outType: String Tipos de salida (deberia ser 1)
*/
export class FuncPipe extends Pipe {

    constructor(name, inTypes, outType) {
       super([], [DIRECTION.BOTTOM]);
       this.inTypes = inTypes || [];
       this.outType = outType || VALUES_TYPES.UNDEFINED;
       this.setName(name);
       this.setInDirection(inTypesToDirections(inTypes));
       this.clean();
    }

    clean() {
        super.clean();
        this.tempInTypes = [...(this.inTypes)];
        this.tempOutType = this.outType
    }

    calcTempTypes(dir, nextType) {
        if(isDefined(nextType)) {
            const type = this.getDirValueType(dir);
            if(isDefined(type)) {
                if(!matchTypes(type, nextType)) {
                    this.addError('No machea tipo');
                }
            } else if(isGeneric(type)) {
                this.tempInTypes = this.tempInTypes
                    .map(inType => inType === type ? nextType : inType);
                this.tempOutType = this.tempOutType === type ? nextType : this.tempOutType;
            } else {
                this.setDirType(dir, nextType);
            }
        }
    }
    //@TODO GENERIC
    calc(context, board, enterDir, path) {
        if(path && path.find((p) => p === this)) {
            this.addError('Loop');
        } else if(!context.isMark(this.getPos())) {
            context.mark(this.getPos());
            const nextPipes = this.getAllDirections().map(processNext(this, board))
                .sort((n1, n2) => sortPipe(n1.pipe, n2.pipe));
            nextPipes.forEach((next) => {
                //Manejo de errores
                if (this.errors) { return; }
                if (next.error) { this.addError(next.error); return; }
                if (!next.pipe || !next.connected) { this.addWarning(`No connectado ${next.dir}`); return; }
                //Process next pipe
                const newPath = enterDir ? [...path, this] : [this];
                if (next.dir !== enterDir) next.pipe.calc(context, board, next.inDir, newPath);
                //Setea Valores
                if (pipeTypeDefined(next.pipe)) {
                    const nextType = pipeDirValueType(next.pipe, next.inDir);
                    this.calcTempTypes(next.dir, nextType);
                }

            });
            if (!this.errors && !pipeTypeDefined(this)) {
                context.unMark(this.getPos());
            }
        }
    }

    getAllDirections() {
        return [...(this.getInDirections()), DIRECTION.BOTTOM]
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    toCode(direction, board) {        
        const arg = this.toCodeArg(direction, board);
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
            default:
                return `${this.name}(${arg.join(', ')})`;
        }
    }

    //Private
    setDirType(direction, type) {
        if (direction === DIRECTION.BOTTOM) {
            this.tempOutType = type;
        } else {
            const dirPos = this.getInDirections().indexOf(direction);
            if(dirPos >= 0) {
                this.tempInTypes[dirPos] = type;
            }
        }
    }

    getDirValueType(direction) {
        if (direction === DIRECTION.BOTTOM) {
           return this.tempOutType;
        }
        return this.getInType(direction);
    }

    getInType(direction) {
        const dirPos = this.getInDirections().indexOf(direction);
        return dirPos > -1 ? this.tempInTypes[dirPos] : null;
    }

    getType() {
        return PIPE_TYPES.FUNCTION;
    }

    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM;
    }

    isInDir(dir) {
        return this.getInDirections().indexOf(dir) >= 0;
    }

    snapshot() {
        return  {
            ...(super.snapshot()),
            name: this.getName(),
            dir: {
                top: this.getDirValueType(DIRECTION.TOP),
                bottom: this.getDirValueType(DIRECTION.BOTTOM),
                right: this.getDirValueType(DIRECTION.RIGHT),
                left: this.getDirValueType(DIRECTION.LEFT)
            }
        }
    }

}