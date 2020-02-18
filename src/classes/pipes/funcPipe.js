import { PIPE_TYPES, VALUES_TYPES, METHOD_FUNCTION, DIRECTION } from '../../constants/constants';
import { Pipe, isMarked, invertDirection, matchTypes, isDefined, isGeneric, processNext, sortPipe} from './pipe'

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
        debugger;
        if(isDefined(nextType)) {
            const type = this.getDirType(dir);
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
    calc(context, board, path) {
        if(!isMarked(context, this)) {
            super.calc(context, board, path);
            const inPath =  invertDirection(path);
            this.getAllDirections().map(processNext(this, board))
                .sort((n1, n2) => sortPipe(n1.pipe, n2.pipe))
                .forEach((next) => {
                    debugger;
                    if (next.error) { this.addError(next.error); return }
                    if (next.pipe) {
                        if (next.dir !== inPath) next.pipe.calc(context, board, next.dir);
                        const nextInvDir = invertDirection(next.dir);
                        const nextType = next.pipe.getDirType(nextInvDir);
                        this.calcTempTypes(next.dir, nextType);
                    } else {
                        this.addWarning(`No connectado ${next.dir}`)
                    }
                });
            //Re intenatr si se marco por un dummy en proceso
            const prev = processNext(this, board)(inPath)
            if (prev.pipe && prev.pipe.inProcess) {
                context.marks[this.getPosX()][this.getPosY()] = false; 
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
        const argv = arg.split(', ');
        switch(this.name) {
            case METHOD_FUNCTION.ADD:
                return `(${argv[0]} + ${argv[1]})`;
            case METHOD_FUNCTION.SUB:
                return `(${argv[0]} - ${argv[1]})`;
            case METHOD_FUNCTION.MUL:
                return `(${argv[0]} * ${argv[1]})`;
            case METHOD_FUNCTION.DIV:
                return `(${argv[0]} / ${argv[1]})`;
            case METHOD_FUNCTION.EQUAL:
                return `(${argv[0]} == ${argv[1]})`;
            case METHOD_FUNCTION.N_EQUAL:
                return `(${argv[0]} /= ${argv[1]})`;
            case METHOD_FUNCTION.GREAT:
                return `(${argv[0]} > ${argv[1]})`;
            case METHOD_FUNCTION.E_GREAT:
                return `(${argv[0]} >= ${argv[1]})`;
            case METHOD_FUNCTION.LEST:
                return `(${argv[0]} < ${argv[1]})`;
            case METHOD_FUNCTION.E_LEST:
                return `(${argv[0]} =< ${argv[1]})`;
            case METHOD_FUNCTION.OR:
                return `(${argv[0]} , ${argv[1]})`;
            default:
                return `${this.name}(${arg})`;
        }
    }

    setInTypes(inTypes) {
        this.inTypes = inTypes;
    }

    getInTypes() {
        return this.tempInTypes ? this.tempInTypes : [];
    }

    setOutTypes(outType) {
        this.outType = outType;
    }

    getOutType() {
        return this.tempOutType;
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

    getDirType(direction) {
        if (direction === DIRECTION.BOTTOM) {
           return this.tempOutType;
        }
        return this.getInType(direction);
    }

    getInType(direction) {
        const dirPos = this.getInDirections().indexOf(direction);
        return dirPos > -1 ? this.getInTypes()[dirPos] : null;
    }

    getType() {
        return PIPE_TYPES.FUNCTION;
    }

    isOutDir(dir) {
        return dir === DIRECTION.BOTTOM;
    }

    isInDir(dir) {
        return this.getInDirections().indexOf(dir) > 0;
    }

    snapshot() {
        return  {
            ...(super.snapshot()),
            name: this.getName(),
            inTypes: {
                top: this.getInType(DIRECTION.TOP),
                left: this.getInType(DIRECTION.LEFT),
                right: this.getInType(DIRECTION.RIGHT),
                list: this.getInTypes(),
            },
            outType: this.getOutType()
        }
    }

}