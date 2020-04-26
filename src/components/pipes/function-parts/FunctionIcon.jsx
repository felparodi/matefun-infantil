
import React from 'react';
import { METHOD_FUNCTION } from '../../../constants/constants';
import * as iconType from '../../../constants/icons';
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
import WorkHat from '../../../icons/workHat.svg';
import WindmillTower from '../../../icons/windmillTower.svg'
import Start from '../../../icons/start.svg';
import Helicopter from '../../../icons/helicopter.svg';
import Car from '../../../icons/car.svg'
import Dron from '../../../icons/dron.svg'
import StudentHat from '../../../icons/studentHat.svg'
import Snowman from '../../../icons/snowman.svg';
import Tshirt from '../../../icons/tshirt.svg';

export function nameIcons(name) {
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

export function iconIcons(icon) {
    switch(icon) {
        case iconType.WORK_HAT:
            return <WorkHat/>;
        case iconType.STUDENT_HAT:
            return <StudentHat/>;
        case iconType.TSHIRT:
            return <Tshirt/>;
        case iconType.WINDMILL_TOWER:
            return <WindmillTower/>;
        case iconType.SNOWMAN:
            return <Snowman/>;
        case iconType.START:
            return <Start/>;
        case iconType.DRON:
            return <Dron/>;
        case iconType.HELICOPTER:
            return <Helicopter/>;
        case iconType.CAR:
            return <Car/>;
        default:
            return <TextIcon text={icon}/>;
    }
}

const FunctionIcon = ({name, icon}) => {
   return icon ? iconIcons(icon) : nameIcons(name)
}

export default FunctionIcon;