import { METHOD_FUNCTION, VALUES_TYPES } from './constants';
import {getDefaultFunction} from './functions';
import { ConditionPipe } from '../classes/pipes/conditionPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ConstPipe } from '../classes/pipes/constPipe';
import { DummyPipe } from '../classes/pipes/dummyPipe'
import { VarPipe } from '../classes/pipes/varPipe';

const toolboxGroups = [
    {
        value: 'mat',
        label: 'Matematica',
        pipes: [
            new ConstPipe(0),
            getDefaultFunction(METHOD_FUNCTION.NEGATIVO),
            getDefaultFunction(METHOD_FUNCTION.ADD),
            getDefaultFunction(METHOD_FUNCTION.SUB),
            getDefaultFunction(METHOD_FUNCTION.MUL),
            getDefaultFunction(METHOD_FUNCTION.DIV),
            getDefaultFunction(METHOD_FUNCTION.EXP),
            getDefaultFunction(METHOD_FUNCTION.RAIZ),
        ]
    },
    { 
        value: 'val',
        label: 'Valores',
        pipes: [
            new VarPipe(VALUES_TYPES.GENERIC),
            new EndPipe(VALUES_TYPES.GENERIC),
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
            getDefaultFunction(METHOD_FUNCTION.AND),
            getDefaultFunction(METHOD_FUNCTION.EQUAL),
            getDefaultFunction(METHOD_FUNCTION.N_EQUAL),
            getDefaultFunction(METHOD_FUNCTION.GREAT),
            getDefaultFunction(METHOD_FUNCTION.E_GREAT),
            getDefaultFunction(METHOD_FUNCTION.LEST),
            getDefaultFunction(METHOD_FUNCTION.E_LEST),
        ]

    },
    {
        value: 'figures',
        label: 'Figuras',
        pipes: [
            new ConstPipe({color:'Rojo'}, VALUES_TYPES.COLOR),
            new ConstPipe({x:0, y:0}, VALUES_TYPES.POINT),
            getDefaultFunction(METHOD_FUNCTION.CIRC),
            getDefaultFunction(METHOD_FUNCTION.RECT),
            //Estos no estan funcionado, LINEA no esta en nuestro interpret, y POLI haceta lista de PUNTOS
            //new FuncPipe(METHOD_FUNCTION.LINEA, [VALUES_TYPES.POINT, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE),
            getDefaultFunction(METHOD_FUNCTION.POLI),
            getDefaultFunction(METHOD_FUNCTION.COLOR),
            getDefaultFunction(METHOD_FUNCTION.ROTAR),
            getDefaultFunction(METHOD_FUNCTION.JUNTAR),
            getDefaultFunction(METHOD_FUNCTION.ESCALAR),
            getDefaultFunction(METHOD_FUNCTION.MOVER),
            getDefaultFunction(METHOD_FUNCTION.AFIG),
        ]
    },
    {
        value: 'list',
        label: 'Listas',
        pipes: [
            new ConstPipe([], VALUES_TYPES.list(VALUES_TYPES.GENERIC)),
            getDefaultFunction(METHOD_FUNCTION.CONCAT),
            getDefaultFunction(METHOD_FUNCTION.PRIMER),
            getDefaultFunction(METHOD_FUNCTION.RESTO),
            getDefaultFunction(METHOD_FUNCTION.RANGO),
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