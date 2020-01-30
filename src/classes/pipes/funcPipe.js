import { PIPE_TYPES, VALUES_TYPES, METHOD_FUNCTION, DIRECTION } from '../../constants/constants';
import { TypePipe } from './typePipe'

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
export class FuncPipe extends TypePipe {

    constructor(name, inTypes, outType) {
       super([], [DIRECTION.BOTTOM]);
       this.setInTypes(inTypes);
       this.setOutTypes([outType]);
       this.setName(name);
       this.setInDirection(inTypesToDirections(inTypes));
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    toCode(direction, blockVars) {
        const arg = this.toCodeArg(direction, blockVars);
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

    getType() {
        return PIPE_TYPES.FUNCTION;
    }

}