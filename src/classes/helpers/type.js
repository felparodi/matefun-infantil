import { VALUES_TYPES } from '../constants/constants'

function getMateFunType(varPipe) {
    const type = varPipe.getValueType();
    switch (type) {
        case VALUES_TYPES.NUMBER:
            return MATEFUN_TYPE.NUMBER;
        case VALUES_TYPES.FIGURE:
            return MATEFUN_TYPE.FIGURE;
        case VALUES_TYPES.POINT:
            return MATEFUN_TYPE.POINT;
        case VALUES_TYPES.COLOR:
            return MATEFUN_TYPE.COLOR;
        default:
            return "?";
    }
}