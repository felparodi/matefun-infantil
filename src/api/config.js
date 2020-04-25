import * as actions from '../redux/config/configAction';

export function openConfig() {
    return (dispatch) => {
        dispatch(actions.openModal());
    }
}

export function closeConfig() {
    return (dispatch) => {
        dispatch(actions.closeModal());
    }
}