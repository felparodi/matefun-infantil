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
        label: 'Constantes',
        icon: icon.INPUT,
        complex: 0,
        pipes: [
            { pipe: new ConstPipe(0), complex: 0, tooltip: 'Número' },
            { pipe: new ConstPipe({x:0, y:0}, VALUES_TYPES.POINT), complex: 0, tooltip: 'Par de números' },
            { pipe: new ConstPipe({color:'Negro'}, VALUES_TYPES.COLOR), complex: 0,  tooltip: 'Color' },
        ]
    },
    { 
        value: 'val',
        label: 'Variables',
        icon: icon.WINDOW,
        complex: 0,
        pipes: [
            { pipe: new VarPipe(VALUES_TYPES.GENERIC), complex: 0, tooltip: 'Genérico' },
            { pipe: new VarPipe(VALUES_TYPES.NUMBER), complex: 0,  tooltip: 'Número' },
            { pipe: new VarPipe(VALUES_TYPES.POINT), complex: 0,  tooltip: 'Par de números' },
            { pipe: new VarPipe(VALUES_TYPES.COLOR), complex: 0, tooltip: 'Color' },
            { pipe: new VarPipe(VALUES_TYPES.FIGURE), complex: 0, tooltip: 'Figura'  },
        ],
    },
    {
        value: 'output',
        label: 'Resultado',
        icon: icon.END,
        complex: 0,
        pipes: [
            { pipe: new EndPipe(VALUES_TYPES.GENERIC), complex: 0, tooltip: 'Resultado' },
        ]
    },
    {
        value: 'mat',
        label: 'Matemática',
        icon: icon.CALCULATOR,
        complex: 0,
        pipes: [
            { pipe: getDefaultFunction(METHOD_FUNCTION.ADD), complex: 0, tooltip: 'Suma' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.SUB), complex: 0, tooltip: 'Resta' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.MUL), complex: 0, tooltip: 'Multipicación' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.DIV), complex: 0, tooltip: 'División' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.NEGATIVO), complex: 1, tooltip: 'Opuesto' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.EXP), complex: 2, tooltip: 'Potencia' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RAIZ), complex: 2, tooltip: 'Raíz cuadrada' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.SEN), complex: 2, tooltip: 'Seno'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.COS),complex: 2, tooltip: 'Coseno' },
        ]
    },
    {  
        value: 'cond',
        label: 'Condiciones y comparadores',
        icon: icon.GREATER_EQUAL,
        complex: 0,
        pipes: [
            { pipe: new ConditionPipe(), complex: 0, tooltip:'Si' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.AND), complex: 0, tooltip:'Y' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.EQUAL), complex: 0, tooltip:'Igual' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.N_EQUAL), complex: 0, tooltip:'Distinto'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.GREAT), complex: 0, tooltip:'Mayor' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.E_GREAT), complex: 0,  tooltip:'Mayor o igual' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.LEST), complex: 0, tooltip:'Menor' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.E_LEST), complex: 0, tooltip:'Menor o igual' },
        ]

    },
    {
        value: 'figures',
        label: 'Figuras',
        icon: icon.SHAPES,
        complex: 0,
        pipes: [
            //{ pipe: getDefaultFunction(METHOD_FUNCTION.POINT), complex: 0, tooltip:'Punto' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.CIRC), complex: 0, tooltip:'Círculo' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RECT), complex: 0, tooltip: 'Rectángulo'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.LINEA), complex: 0, tooltip: 'Línea' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.POLI), complex: 5, tooltip: 'Polígono' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.COLOR), complex: 0, tooltip: 'Pintar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.ROTAR), complex: 0, tooltip: 'Rotar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.JUNTAR), complex: 0, tooltip: 'Agrupar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.ESCALAR), complex: 0, tooltip: 'Escalar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.MOVER), complex: 0, tooltip: 'Mover' },
            //{ pipe: getDefaultFunction(METHOD_FUNCTION.AFIG), complex: 1, tooltip: 'Transformar en Figura' },
        ]
    },
    {
        value: 'list',
        label: 'Listas',
        icon: icon.LIST,
        complex: 5,
        pipes: [
            { pipe: new ConstPipe([], VALUES_TYPES.list(VALUES_TYPES.GENERIC)), complex: 5, tooltip: 'Crear lista vacía' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.CONCAT), complex: 5, tooltip: 'Agregar elemento al principio' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.PRIMER), complex: 5, tooltip: 'Obtener primer elemento' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RESTO), complex: 5, tooltip: 'Obtener resto'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.RANGO), complex: 5, tooltip: 'Rango' },
        ]
    },
    {
        value: 'custom',
        label: 'Mis funciones guardadas',
        icon: icon.FOLDER,
        complex: 0,
        pipes: [
        ]
    }
];

export default ToolboxGroups;