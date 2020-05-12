
import React from 'react';
import { METHOD_FUNCTION } from '../../../constants/constants';
import TextIcon from './TextIcon';
import Color from '../../../icons/color.svg'
import Rotar from '../../../icons/rotar.svg'
import Circ from '../../../icons/circ.svg'
import Escalar from '../../../icons/escalar.svg'
import Rect from '../../../icons/rect.svg'
import Linea from '../../../icons/linea.svg'
import Poli from '../../../icons/poli.svg'
import Mover from '../../../icons/mover.svg'
import Puzzle from '../../../icons/puzzle-pices.svg';
import Resto from '../../../icons/resto.svg';
import Primero from '../../../icons/primero.svg';
import Rango from '../../../icons/rango.svg';
import AFIG from '../../../icons/aFig.svg';

import Icon from '../../Icon';

export function nameDescriptor(name) {
    switch(name) {
        case METHOD_FUNCTION.COLOR:
            return <Color/>;
        case METHOD_FUNCTION.ROTAR:
            return <Rotar/>;
        case METHOD_FUNCTION.RECT:
            return <Rect/>;
        case METHOD_FUNCTION.LINEA:
            return <Linea/>
        case METHOD_FUNCTION.POLI:
            return <Poli/>;
        case METHOD_FUNCTION.ESCALAR:
            return <Escalar/>;
        case METHOD_FUNCTION.MOVER: 
            return <Mover/>;
        case METHOD_FUNCTION.CIRC:
            return <Circ/>
        case METHOD_FUNCTION.ADD:
            return <TextIcon text="+"/>;
        case METHOD_FUNCTION.SUB:
        case METHOD_FUNCTION.NEGATIVO:
            return <TextIcon text="-"/>;
        case METHOD_FUNCTION.MUL:
            return <TextIcon text="x"/>;
        case METHOD_FUNCTION.DIV:
            return <TextIcon text="%"/>;
        case METHOD_FUNCTION.EQUAL:
            return <TextIcon text="="/>;
        case METHOD_FUNCTION.N_EQUAL:
            return <TextIcon text="&ne;"/>;
        case METHOD_FUNCTION.GREAT:
            return <TextIcon text=">"/>;
        case METHOD_FUNCTION.E_GREAT:
            return <TextIcon text="&ge;"/>;
        case METHOD_FUNCTION.LEST:
            return <TextIcon text="<"/>;
        case METHOD_FUNCTION.E_LEST:
            return <TextIcon text="&le;"/>;
        case METHOD_FUNCTION.EXP:
            return <TextIcon text="^"/>;
        case METHOD_FUNCTION.RAIZ: 
            return <TextIcon text="&radic;"/>
        case METHOD_FUNCTION.JUNTAR:
            return <Puzzle/>;
        case METHOD_FUNCTION.CONCAT:
            return <TextIcon text=":"/>;
        case METHOD_FUNCTION.RESTO:
            return <Resto/>;
        case METHOD_FUNCTION.PRIMER:
            return <Primero/>;
        case METHOD_FUNCTION.RANGO:
            return <Rango/>;
        case METHOD_FUNCTION.AFIG:
            return <AFIG/>;
        default:
            return <TextIcon text={name}/>;
    }
}

const FunctionDescriptor = ({name, icon}) => {
   return icon ? 
    <svg viewBox="0 0 12 30">
        <Icon icon={icon} color="white"/>
    </svg>
    : 
    nameDescriptor(name)
}

export default FunctionDescriptor;