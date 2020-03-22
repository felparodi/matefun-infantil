
export const DIRECTION = Object.freeze({
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
})

export const METHOD_FUNCTION = Object.freeze({
    ADD: 'ADD',
    MUL: 'MUL',
    SUB: 'SUB',
    DIV: 'DIV',
    COLOR: 'color',
    ROTAR: 'rotar',
    CIRC: 'circ',
    RECT: 'rect',
    LINEA: 'linea',
    POLI:'poli',
    ESCALAR: 'escalar',
    MOVER: 'mover',
    GREAT: 'GREAT',
    E_GREAT: 'EGREAT',
    LEST: 'LEST',
    E_LEST: 'E_LEST',
    EQUAL: 'EQUAL',
    N_EQUAL: 'N_EQUAL',
    NOT: 'NOT',
    OR: 'OR',
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
    LIST_NUMBER: 'R*',
})

export const ERROR = Object.freeze({
    CODE: Object.freeze({
        MISSING_PARENT: 'MISSING_PARENT'
    })
})

export const BOARD_ROWS= 10;
export const BOARD_COLS= 15;

export const WORKSPACE_FILE_NAME= 'Workspace';
export const MYFUNCTIONS_FILE_NAME= "MyFunctions"