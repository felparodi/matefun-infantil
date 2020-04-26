import * as actionType from './toastActionType';
import * as toastType from '../../constants/toast';

export const infoToast = (text, title="INFORMACION") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    payload: {
        type: toastType.INFO,
        text: text,
        title: title
    }
})

export const errorToast = (text, title="ERROR") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    payload: {
        type: toastType.ERROR,
        text: text,
        title: title
    }
})

export const warningToast = (text, title="ADEVERTECIA") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    payload: {
        type: toastType.WARNING,
        text: text,
        title: title
    }
})

export const successToast = (text, title="EXITO") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    payload: {
        type: toastType.INFO,
        text: text,
        title: title
    }
})