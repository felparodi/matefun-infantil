
export const DIRECTION = Object.freeze({
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
})

export const METHOD_FUNCTION = Object.freeze({
    //MATEMATICAS
    ADD: 'ADD', //NATIVA
    MUL: 'MUL', //NATIVA
    SUB: 'SUB', //NATIVA
    DIV: 'DIV', //NATIVA
    EXP: 'EXP', //NATIVA
    RED: 'red ', // "red :: R -> R" Devuevle parte entera
    RAIZ: 'raizcuad', // "raizcuad :: R -> R"
    COS: 'cos', // "cos :: R -> R"
    SEN: 'sen', // "sen :: R -> R"
    NEGATIVO: '-', // "- :: R -> R"
    //IMAGENS
    COLOR: 'color', // "color :: (Fig X Color) -> Fig"
    RGB: 'rgb', // "rgb :: (R X R X R) -> Color"
    ROTAR: 'rotar', // "rotar :: (Fig X R) -> Fig"s
    CIRC: 'circ', // "circ :: R -> Fig"
    RECT: 'rect', // "rect :: (R X R) -> Fig"
    LINEA: 'linea', // "linea :: ((R X R) X (R X R)) -> Fig"
    JUNTAR: 'juntar', // "juntar :: (Fig X Fig) -> Fig"
    POLI:'poli', // "poli :: (R X R)* -> Fig"
    ESCALAR: 'escalar', // "escalar :: (Fig X R) -> Fig"
    MOVER: 'mover', // "mover :: (Fig X (R X R)) -> Fig"
    AFIG: 'aFig', // "aFig :: A -> Fig"
    //CONDICIONE
    GREAT: 'GREAT', //NATIVA
    E_GREAT: 'EGREAT', //NATIVA
    LEST: 'LEST', //NATIVA
    E_LEST: 'E_LEST', //NATIVA
    EQUAL: 'EQUAL', //NATIVA
    N_EQUAL: 'N_EQUAL', //NATIVA
    AND: 'Y',
    //3D
    LINEA_3D: 'linea3D', // "linea3D :: ((R X R X R) X (R X R X R)) -> Fig3D"
    ESFERA: 'esfera', // "esfera :: R -> Fig3D"
    CILINDRO: 'cilindro', // "cilindro :: (R X R X R) -> Fig3D"
    CUBO: 'cubo', // "cubo :: (R X R X R) -> Fig3D"
    ANILLO: 'anillo', // "anillo :: (R X R X R) -> Fig3D"
    JUNTAR_3D: 'juntar3D', // "juntar3D :: (Fig3D X Fig3D) -> Fig3D"
    COLOR_3D: 'color3D', // "color3D :: (Fig3D X Color) -> Fig3D"
    MOVER_3D: 'mover3D', // "mover3D :: (Fig3D X (R X R X R)) -> Fig3D"
    ROTAR_3D: 'rotar3D', // "rotar3D :: (Fig3D X (R X R X R)) -> Fig3D"
    ESCALAR_3D: 'escalar3D', // "escalar3D :: (Fig3D X R) -> Fig3D"
    //LISTA
    RANGO: 'rango', // "rango :: (R X R X R) -> R*" Numeros entre dos de a pasos del terser
    PRIMER: 'primero', // "primero :: A* -> A"
    REST: 'resto', // "resto :: A* -> A*"
})

export const PIPE_TYPES= Object.freeze({
    DUMMY: 'DUMMY',
    FUNCTION: 'FUNCTION',
    VALUE: 'VALUE',
    END: 'END',
    UNDEFINED: '?',
    VARIABLE: 'VARIABLE',
    CONDITION: 'CONDITION',
})

export const VALUES_TYPES= Object.freeze({
    BOOLEAN: 'BOOLEAN',
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    ARRAY: 'ARRAY',
    FUNCTION: 'FUNCTION',
    OTHER: 'OTHER',
    POINT: 'POINT',
    VAR: 'VAR',
    COLOR: 'COLOR',
    FIGURE: 'FIGURE',
    UNDEFINED: 'UNDEFINED',
    LIST_NUMBER: 'LIST_NUMBER',
    GENERIC: 'GENERIC',
    GENERIC2: 'GENERIC2',
    GENERIC3: 'GENERIC3',
})

export const MATEFUN_TYPE= Object.freeze({
    NUMBER: 'R',
    FIGURE: 'Fig',
    COLOR: 'Color',
    POINT: '(R x R)',
    list: (t) => `${t}*`,
    GENERIC: 'A',

})

export const ERROR = Object.freeze({
    CODE: Object.freeze({
        MISSING_PARENT: 'MISSING_PARENT'
    })
})

export const BOARD_ROWS= 20;
export const BOARD_COLS= 15;