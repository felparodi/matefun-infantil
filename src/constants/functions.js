import { METHOD_FUNCTION, VALUES_TYPES } from '../constants/constants';
import { FuncPipe } from '../classes/pipes/funcPipe';

const {NUMBER, BOOLEAN, FIGURE, POINT, COLOR, GENERIC, list} = VALUES_TYPES;

const defaultFunctions = [
    //MATH
    new FuncPipe(METHOD_FUNCTION.NEGATIVO, [NUMBER], NUMBER),
    new FuncPipe(METHOD_FUNCTION.ADD, [NUMBER, NUMBER], NUMBER),
    new FuncPipe(METHOD_FUNCTION.SUB, [NUMBER, NUMBER], NUMBER),
    new FuncPipe(METHOD_FUNCTION.MUL, [NUMBER, NUMBER], NUMBER),
    new FuncPipe(METHOD_FUNCTION.DIV, [NUMBER, NUMBER], NUMBER),
    new FuncPipe(METHOD_FUNCTION.EXP, [NUMBER, NUMBER], NUMBER),
    new FuncPipe(METHOD_FUNCTION.RAIZ, [NUMBER], NUMBER),
    //CONDITION
    new FuncPipe(METHOD_FUNCTION.AND, [BOOLEAN, BOOLEAN], BOOLEAN),
    new FuncPipe(METHOD_FUNCTION.EQUAL, [GENERIC, GENERIC], BOOLEAN),
    new FuncPipe(METHOD_FUNCTION.N_EQUAL, [GENERIC, GENERIC], BOOLEAN),
    new FuncPipe(METHOD_FUNCTION.GREAT, [NUMBER, NUMBER], BOOLEAN),
    new FuncPipe(METHOD_FUNCTION.E_GREAT, [NUMBER, NUMBER], BOOLEAN),
    new FuncPipe(METHOD_FUNCTION.LEST, [NUMBER, NUMBER], BOOLEAN),
    new FuncPipe(METHOD_FUNCTION.E_LEST, [NUMBER, NUMBER], BOOLEAN),
    //GRAPH
    new FuncPipe(METHOD_FUNCTION.CIRC, [NUMBER], FIGURE),
    new FuncPipe(METHOD_FUNCTION.RECT, [NUMBER, NUMBER], FIGURE),
    new FuncPipe(METHOD_FUNCTION.LINEA, [POINT, POINT], FIGURE),
    new FuncPipe(METHOD_FUNCTION.POLI, [list(POINT)], FIGURE),
    new FuncPipe(METHOD_FUNCTION.COLOR, [FIGURE, COLOR], FIGURE),
    new FuncPipe(METHOD_FUNCTION.ROTAR, [FIGURE, NUMBER], FIGURE),
    new FuncPipe(METHOD_FUNCTION.JUNTAR, [FIGURE, FIGURE], FIGURE),
    new FuncPipe(METHOD_FUNCTION.ESCALAR, [FIGURE, NUMBER], FIGURE),
    new FuncPipe(METHOD_FUNCTION.MOVER, [FIGURE, POINT], FIGURE),
    new FuncPipe(METHOD_FUNCTION.AFIG, [GENERIC], FIGURE),
    //LIST
    new FuncPipe(METHOD_FUNCTION.CONCAT, [GENERIC, list(GENERIC), null], list(GENERIC)),
    new FuncPipe(METHOD_FUNCTION.RANGO, [NUMBER, NUMBER, NUMBER], list(NUMBER)),
    new FuncPipe(METHOD_FUNCTION.PRIMER, [list(GENERIC)], GENERIC),
    new FuncPipe(METHOD_FUNCTION.RESTO, [list(GENERIC)], list(GENERIC))
]

export function getDefaultFunction(name) {
    const def = defaultFunctions.find(f => f.name === name);
    if (def) {
        return new FuncPipe(def.name, def.inTypes, def.outType);
    }
    return undefined;
}