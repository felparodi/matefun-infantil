
import React from 'react';
import { METHOD_FUNCTION } from '../../../constants/constants';
import TextIcon from '../../icons/TextIcon';
import Icon from '../../icons/Icon';
import * as icons from '../../../constants/icons';

function getIconForMethod(name) {
    switch(name){
        case METHOD_FUNCTION.ADD:
            return icons.PLUS
        case METHOD_FUNCTION.SUB:
        case METHOD_FUNCTION.NEGATIVO:
            return icons.MINUS
        case METHOD_FUNCTION.MUL:
            return icons.TIMES
        case METHOD_FUNCTION.DIV:
            return icons.DIVIDE
        case METHOD_FUNCTION.RAIZ:
            return icons.ROOT;
        case METHOD_FUNCTION.EXP:
            return icons.EXP;
        case METHOD_FUNCTION.EQUAL:
            return icons.EQUAL
        case METHOD_FUNCTION.N_EQUAL:
            return icons.NOT_EQUAL
        case METHOD_FUNCTION.GREAT:
            return icons.GREATER
        case METHOD_FUNCTION.E_GREAT:
            return icons.GREATER_EQUAL
        case METHOD_FUNCTION.LEST:
            return icons.LESS
        case METHOD_FUNCTION.E_LEST:
            return icons.LESS_EQUAL
        case METHOD_FUNCTION.CIRC:
            return icons.CIRCLE
        case METHOD_FUNCTION.ROTAR:
            return icons.ROTATE
        case METHOD_FUNCTION.COLOR:
            return icons.PAINT
        case METHOD_FUNCTION.MOVER:
            return icons.MOVE
        case METHOD_FUNCTION.ESCALAR:
            return icons.SCALE
        case METHOD_FUNCTION.JUNTAR:
            return icons.GROUP
        case METHOD_FUNCTION.RECT:
            return icons.RECT
        case METHOD_FUNCTION.LINEA:
            return icons.LINE;
        case METHOD_FUNCTION.POLI:
            return icons.POLYGON;
        case METHOD_FUNCTION.CONCAT:
            return icons.CONCAT;
        case METHOD_FUNCTION.RESTO:
            return icons.TAIL;
        case METHOD_FUNCTION.PRIMER:
            return icons.FIRST;
        case METHOD_FUNCTION.RANGO:
            return icons.RANGE;
        case METHOD_FUNCTION.AFIG:
            return icons.A_FIG;
    }
}

const FunctionDescriptor = ({name, icon}) => {
    const iconMethod = getIconForMethod(name);
    return icon || iconMethod ? 
        <svg viewBox="0 0 18 40">
            <Icon icon={icon || iconMethod} color="white"/>
        </svg>
        : 
        <TextIcon text={name}/>
}

export default FunctionDescriptor;