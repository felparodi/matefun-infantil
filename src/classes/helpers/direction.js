import { DIRECTION } from '../../constants/constants';

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
