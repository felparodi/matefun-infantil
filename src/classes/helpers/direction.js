import { DIRECTION } from '../../constants/constants';

/*
*   @desc: Devuelve una posicion de un movimiento en una direcion sobre otra posicion
*   @attr Position pos: Posicion de la que se desa mover
*   @attr Direction direction: Direcion asi la cual se desa mover
*   @return: Position
*   @scope: public
*/
export function directionMove(pos, direction) {
    const {x, y} = pos;
    switch(direction) {
        case DIRECTION.BOTTOM:
            return {x:x+1, y}
        case DIRECTION.TOP:
            return {x:x-1, y}
        case DIRECTION.RIGHT:
            return {x, y:y+1}
        case DIRECTION.LEFT:
            return {x, y:y-1}
    }
    return {x, y}
}

/*
*   @desc: Devuelve la direcion opuesta a otra direcion
*   @attr Direction direcion: Direcion que se desea saber su opuesta
*   @return: Direction
*   @scope: public
*/
export function invertDirection(direction) {
    switch(direction) {
        case DIRECTION.BOTTOM:
            return DIRECTION.TOP;
        case DIRECTION.TOP:
            return DIRECTION.BOTTOM;
        case DIRECTION.LEFT:
            return DIRECTION.RIGHT;
        case DIRECTION.RIGHT:
            return DIRECTION.LEFT;
    }
}
