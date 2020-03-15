import { DIRECTION, METHOD_FUNCTION, VALUES_TYPES } from '../constants/constants'
import { FuncPipe } from '../classes/pipes/funcPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ConstPipe } from '../classes/pipes/constPipe';
import { DummyPipe } from '../classes/pipes/dummyPipe'
import { VarPipe } from '../classes/pipes/varPipe';
import { ConditionPipe } from '../classes/pipes/conditionPipe';

const toolboxGroups = [
    {
        value: 'mat',
        label: 'Matematica',
        pipes: [
            new ConstPipe(0),
            new FuncPipe(METHOD_FUNCTION.NEGATIVO, [VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.ADD, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.SUB, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.MUL, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.DIV, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.EXP, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.RAIZ, [VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
        ]
    },
    { 
        value: 'val',
        label: 'Valores',
        pipes: [
            new VarPipe(),
            new EndPipe(),
            new VarPipe(VALUES_TYPES.NUMBER),
            new EndPipe(VALUES_TYPES.NUMBER),
            new VarPipe(VALUES_TYPES.POINT),
            new EndPipe(VALUES_TYPES.POINT),
            new VarPipe(VALUES_TYPES.COLOR),
            new EndPipe(VALUES_TYPES.COLOR),
            new EndPipe(VALUES_TYPES.FIGURE),
        ],
    },
    {  
        value: 'cond',
        label: 'Condiciones',
        pipes: [
            new ConditionPipe(),
            new FuncPipe(METHOD_FUNCTION.AND, [VALUES_TYPES.BOOLEAN, VALUES_TYPES.BOOLEAN], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.EQUAL, [VALUES_TYPES.GENERIC, VALUES_TYPES.GENERIC], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.N_EQUAL, [VALUES_TYPES.GENERIC, VALUES_TYPES.GENERIC], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.GREAT, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.E_GREAT, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.LEST, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.E_LEST, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
        ]

    },
    {
        value: 'figures',
        label: 'Figuras',
        pipes: [
            new ConstPipe({color:'Rojo'}, VALUES_TYPES.COLOR),
            new ConstPipe({x:0, y:0}, VALUES_TYPES.POINT),
            new FuncPipe(METHOD_FUNCTION.CIRC, [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe(METHOD_FUNCTION.RECT, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            //Estos no estan funcionado, LINEA no esta en nuestro interpret, y POLI haceta lista de PUNTOS
            //new FuncPipe(METHOD_FUNCTION.LINEA, [VALUES_TYPES.POINT, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE),
            //new FuncPipe(METHOD_FUNCTION.POLI, [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe(METHOD_FUNCTION.COLOR, [VALUES_TYPES.FIGURE, VALUES_TYPES.COLOR], VALUES_TYPES.FIGURE),
            new FuncPipe(METHOD_FUNCTION.ROTAR, [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe(METHOD_FUNCTION.JUNTAR, [VALUES_TYPES.FIGURE, VALUES_TYPES.FIGURE], VALUES_TYPES.FIGURE),
            new FuncPipe(METHOD_FUNCTION.ESCALAR, [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe(METHOD_FUNCTION.MOVER, [VALUES_TYPES.FIGURE, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE),
        ]
    },
    {
        value: 'custom',
        label: 'Custom',
        pipes: [
        ]
    }
];

export default toolboxGroups;