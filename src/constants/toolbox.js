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
            { pipe: new ConstPipe(0), complex: 0, tooltip: 'Valor Numerico' },
            { pipe: new ConstPipe({x:0, y:0}, VALUES_TYPES.POINT), complex: 0, tooltip: 'Valor Punto' },
            { pipe: new ConstPipe({color:'Negro'}, VALUES_TYPES.COLOR), complex: 0,  tooltip: 'Valor Color' },
        ]
    },
    { 
        value: 'val',
        label: 'Valores',
        icon: icon.WINDOW,
        complex: 0,
        pipes: [
            { pipe: new VarPipe(VALUES_TYPES.GENERIC), complex: 0, tooltip: 'Variable Sin Typo' },
            { pipe: new VarPipe(VALUES_TYPES.NUMBER), complex: 0,  tooltip: 'Variable Numerica' },
            { pipe: new VarPipe(VALUES_TYPES.POINT), complex: 0,  tooltip: 'Variable Punto' },
            { pipe: new VarPipe(VALUES_TYPES.COLOR), complex: 0, tooltip: 'Variable Color' },
            { pipe: new VarPipe(VALUES_TYPES.FIGURE), complex: 0, tooltip: 'Variable Imagen'  },
        ],
    },
    {
        value: 'output',
        label: 'Salida',
        icon: icon.END,
        complex: 0,
        pipes: [
            { pipe: new EndPipe(VALUES_TYPES.GENERIC), complex: 0, tooltip: 'Salida' },
        ]
    },
    {
        value: 'mat',
        label: 'Matematica',
        icon: icon.CALCULATOR,
        complex: 0,
        pipes: [
            { pipe: getDefaultFunction(METHOD_FUNCTION.ADD), complex: 0, tooltip: 'Sumar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.SUB), complex: 0, tooltip: 'Restar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.MUL), complex: 0, tooltip: 'Multipicar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.DIV), complex: 0, tooltip: 'Dividir' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.NEGATIVO), complex: 1, tooltip: 'Negativo' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.EXP), complex: 2, tooltip: 'Potencia' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RAIZ), complex: 2, tooltip: 'Raiz Cuadrada' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.SEN), complex: 2, tooltip: 'Seno'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.COS),complex: 2, tooltip: 'Coseno' },
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
            { pipe: getDefaultFunction(METHOD_FUNCTION.EQUAL), complex: 0, tooltip:'Iguales' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.N_EQUAL), complex: 0, tooltip:'Diferentes'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.GREAT), complex: 0, tooltip:'Mayor' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.E_GREAT), complex: 0,  tooltip:'Mayor' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.LEST), complex: 0, tooltip:'Menor' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.E_LEST), complex: 0, tooltip:'Menor o Igual' },
        ]

    },
    {
        value: 'figures',
        label: 'Figuras',
        icon: icon.SHAPES,
        complex: 0,
        pipes: [
            { pipe: getDefaultFunction(METHOD_FUNCTION.CIRC), complex: 0, tooltip:'Circulo' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RECT), complex: 0, tooltip: 'Rectangulo'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.LINEA), complex: 0, tooltip: 'Linea' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.POLI), complex: 5, tooltip: 'Poligono' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.COLOR), complex: 0, tooltip: 'Pintar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.ROTAR), complex: 0, tooltip: 'Rotar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.JUNTAR), complex: 0, tooltip: 'Unir' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.ESCALAR), complex: 0, tooltip: 'Escalar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.MOVER), complex: 0, tooltip: 'Mover' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.AFIG), complex: 1, tooltip: 'Transformar en Figura' },
        ]
    },
    {
        value: 'list',
        label: 'Listas',
        icon: icon.LIST,
        complex: 5,
        pipes: [
            { pipe: new ConstPipe([], VALUES_TYPES.list(VALUES_TYPES.GENERIC)), complex: 5, tooltip: 'Lista Vacia' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.CONCAT), complex: 5, tooltip: 'Concatenar' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.PRIMER), complex: 5, tooltip: 'Primer de la Lista' },
            { pipe: getDefaultFunction(METHOD_FUNCTION.RESTO), complex: 5, tooltip: 'Resto de la Lista'},
            { pipe: getDefaultFunction(METHOD_FUNCTION.RANGO), complex: 5, tooltip: 'Lista Rango' },
        ]
    },
    {
        value: 'custom',
        label: 'Custom',
        icon: icon.FOLDER,
        complex: 0,
        pipes: [
        ]
    }
];

export default ToolboxGroups;