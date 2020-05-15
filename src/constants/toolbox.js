import { METHOD_FUNCTION, VALUES_TYPES } from './constants';
import { getDefaultFunction } from './functions';
import { ConditionPipe } from '../classes/pipes/conditionPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ConstPipe } from '../classes/pipes/constPipe';
import { VarPipe } from '../classes/pipes/varPipe';
import * as icon from './icons';

export const COMPLEX = 0;
export const ToolboxGroups = [
    {
        value: 'inputs',
        label: 'Inputs',
        icon: icon.INPUT,
        complex: 0,
        pipes: [
            { pipe: new ConstPipe(0), complex: 0 },
            { pipe: new ConstPipe({color:'Negro'}, VALUES_TYPES.COLOR), complex: 0 },
            { pipe: new ConstPipe({x:0, y:0}, VALUES_TYPES.POINT), complex: 0 },
            { pipe: new EndPipe(VALUES_TYPES.GENERIC), complex: 0 },
        ]
    },
    { 
        value: 'val',
        label: 'Valores',
        icon: icon.WINDOW,
        complex: 0,
        pipes: [
            { pipe: new EndPipe(VALUES_TYPES.GENERIC), complex: 0 },
            { pipe: new VarPipe(VALUES_TYPES.GENERIC), complex: 0 },
            { pipe: new VarPipe(VALUES_TYPES.NUMBER), complex: 0 },
            { pipe: new VarPipe(VALUES_TYPES.POINT), complex: 0 },
            { pipe: new VarPipe(VALUES_TYPES.COLOR), complex: 0 },
            { pipe: new VarPipe(VALUES_TYPES.FIGURE), complex: 0 },
        ],
    },
    {
        value: 'mat',
        label: 'Mate',
        icon: icon.CALCULATOR,
        complex: 0,
        pipes: [
            { pipe: getDefaultFunction(METHOD_FUNCTION.ADD), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.SUB), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.MUL), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.DIV), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.NEGATIVO), complex: 1 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.EXP), complex: 2 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RAIZ), complex: 2 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.SEN), complex: 2},
            { pipe: getDefaultFunction(METHOD_FUNCTION.COS),complex: 2 },
        ]
    },
    {  
        value: 'cond',
        label: 'Condiciones',
        icon: icon.GREATER_EQUAL,
        complex: 0,
        pipes: [
            { pipe: new ConditionPipe(), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.AND), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.EQUAL), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.N_EQUAL), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.GREAT), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.E_GREAT), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.LEST), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.E_LEST), complex: 0 },
        ]

    },
    {
        value: 'figures',
        label: 'Figuras',
        icon: icon.SHAPES,
        complex: 0,
        pipes: [
            { pipe: getDefaultFunction(METHOD_FUNCTION.CIRC), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RECT), complex: 0 },
            //Estos no estan funcionado, LINEA no esta en nuestro interpret
            //{ pipe: getDefaultFunction(METHOD_FUNCTION.LINEA), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.POLI), complex: 5 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.COLOR), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.ROTAR), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.JUNTAR), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.ESCALAR), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.MOVER), complex: 0 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.AFIG), complex: 1 },
        ]
    },
    {
        value: 'list',
        label: 'Listas',
        icon: icon.LIST,
        complex: 5,
        pipes: [
            { pipe: new ConstPipe([], VALUES_TYPES.list(VALUES_TYPES.GENERIC)), complex: 5 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.CONCAT), complex: 5 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.PRIMER), complex: 5 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RESTO), complex: 5 },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RANGO), complex: 5 },
        ]
    },
    {
        value: 'custom',
        label: 'Custom',
        icon: icon.SAVE,
        complex: 0,
        pipes: [
        ]
    }
];

export default ToolboxGroups;