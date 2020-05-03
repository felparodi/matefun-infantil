
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
import School from '../../../icons/school.svg';
import Rule from '../../../icons/rule.svg';
import Deer from '../../../icons/deer.svg';
import Rocket from '../../../icons/rocket.svg'
import PoliceHat from '../../../icons/policeHat.svg';
import Plane from '../../../icons/plane.svg';
import Pizza from '../../../icons/pizza.svg';
import Pie from '../../../icons/pie.svg';
import Pancake from '../../../icons/pancake.svg';
import Bulb from '../../../icons/bulb.svg';
import Crown from '../../../icons/crown.svg';
import Leaf from '../../../icons/leaf.svg';
import Heart from '../../../icons/heart.svg';
import StartSolid from '../../../icons/startSolid.svg';
import CookHat from '../../../icons/cookHat.svg';
import Cloud from '../../../icons/cloud.svg';
import Bolt from '../../../icons/bolt.svg';
import Headphone from '../../../icons/headphone.svg';
import GameController from '../../../icons/game-controller.svg';
import IceCream from '../../../icons/ice-cream.svg';
import HeartSolid from '../../../icons/heart-solid.svg';
import Hamburger from '../../../icons/hamburger.svg';
import AutumnLeaf from '../../../icons/autumn_leaf.svg';
import PoisonBottle from '../../../icons/poison-bottle.svg';
import Candy from '../../../icons/candy.svg';
import GardenerHat from '../../../icons/gardener-hat.svg';

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
        case iconType.SCHOOL:
            return <School/>;
        case iconType.RULE:
            return <Rule/>;
        case iconType.DEER:
            return <Deer/>;
        case iconType.ROCKET:
            return <Rocket/>;
        case iconType.POLICE_HAT:
            return <PoliceHat/>;
        case iconType.PLANE:
            return <Plane/>;
        case iconType.PIZZA:
            return <Pizza/>;
        case iconType.PIE:
            return <Pie/>;
        case iconType.PANCAKE:
            return <Pancake/>;
        case iconType.BULB:
            return <Bulb/>;
        case iconType.CROWN:
            return <Crown/>
        case iconType.LEAF:
            return <Leaf/>;
        case iconType.HEART:
            return <Heart/>;
        case iconType.START_SOLID:
            return <StartSolid/>;
        case iconType.COOK_HAT:
            return <CookHat/>;
        case iconType.CLOUD:
            return <Cloud/>;
        case iconType.BOLT:
            return <Bolt/>;
        case iconType.HEADPHONE:
            return <Headphone/>;
        case iconType.GAME_CONTROLLER:
            return <GameController/>;
        case iconType.ICE_CREAM:
            return <IceCream/>;
        case iconType.HEART_SOLID:
            return <HeartSolid/>;
        case iconType.HAMBURGER:
            return <Hamburger/>;
        case iconType.AUTUMN_LEAF:
            return <AutumnLeaf/>;
        case iconType.POISON_BOTTLE:
            return <PoisonBottle/>;
        case iconType.CANDY:
            return <Candy/>;
        case iconType.GARDENER_HAT:
            return <GardenerHat/>;
        default:
            return <TextIcon text={icon}/>;
    }
}

const FunctionIcon = ({name, icon}) => {
   return icon ? iconIcons(icon) : nameIcons(name)
}

export default FunctionIcon;