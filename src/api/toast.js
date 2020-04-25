import * as actions from '../redux/toast/toastAction';
import store from '../redux/store';

export function createInfoMessage(text, title) {
    store.dispatch(actions.infoToast(text, title));
}
export function createSuccessMessage(text, title) {
    store.dispatch(actions.successToast(text, title));
}
export function createErrorMessage(text, title) {
    store.dispatch(actions.errorToast(text, title));
}
export function createWarningMessage(text, title) {
    store.dispatch(actions.warningToast(text, title));
}