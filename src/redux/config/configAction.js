import * as actionType from './configActionTypes';

export const openModal = () => {
    return {
        type: actionType.OPEN_CONFIG_MODAL
    }
}

export const closeModal = () => {
    return {
        type: actionType.CLOSE_CONFIG_MODAL
    }
}

export const setComplex = (level) => {
    return {
        type: actionType.SET_COMPLEX,
        payload: level
    }
}