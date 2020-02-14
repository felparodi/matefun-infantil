
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
    DIV: 'DIV'
})

export const PIPE_TYPES= Object.freeze({
    DUMMY: 'DUMMY',
    FUNCTION: 'FUNCTION',
    VALUE: 'VALUE',
    END: 'END',
    UNDEFINED: '?',
    VARIABLE: 'VARIABLE'
})

export const VALUES_TYPES= Object.freeze({
    BOOLEAN: 'BOOLEAN',
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    ARRAY: 'ARRAY',
    FUNCTION: 'FUNCTION',
    OTHER: 'OTHER',
    VAR: 'VAR',
    COLOR: 'COLOR',
    FIGURE: 'FIGURE',
    UNDEFINED: 'UNDEFINED',
    LIST_NUMBER: 'LIST_NUMBER',
})

export const MATEFUN_TYPE= Object.freeze({
    NUMBER: 'R',
    FIGURE: 'Fig',
    COLOR: 'Color',
    POINT: '(R x R)',
    LIST_NUMBER: 'R*',
    POINT: 'POINT'
})

export const ERROR = Object.freeze({
    CODE: Object.freeze({
        MISSING_PARENT: 'MISSING_PARENT'
    })
})

export default { DIRECTION, PIPE_TYPES };

export const BOARD_ROWS= 8;
export const BOARD_COLS= 14;

export const CELL_SIZE=7;

export const TOOLBOX_BTN_SIZE= '50px';