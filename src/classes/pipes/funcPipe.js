import { PIPE_TYPES, VALUES_TYPES, METHOD_FUNCTION, DIRECTION } from '../../constants/constants';
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
        this.tempInTypes = [...(this.inTypes)];
        this.tempOutType = this.outType
    }

    //@TODO GENERIC
    calc(context) {
        super.calc(context)
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
                return `(${argv[0]} - ${argv[1]})`
            case METHOD_FUNCTION.MUL:
                return `(${argv[0]} * ${argv[1]})`
            case METHOD_FUNCTION.DIV:
                return `(${argv[0]} / ${argv[1]})`
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

    getInType(direction) {
        const dirPos = this.getInDirections().indexOf(direction);
        return dirPos > -1 ? this.getInTypes()[dirPos] : null;
    }

    getType() {
        return PIPE_TYPES.FUNCTION;
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