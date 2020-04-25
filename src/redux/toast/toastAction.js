import * as actionType from './toastActionType';
import * as toastType from '../../constants/toast';

export const infoToast = (text, title="INFORMACION") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    toast: {
        type: toastType.INFO,
        title: title,
        text: text
    }
})

export const errorToast = (text, title="ERROR") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    toast: {
        type: toastType.ERROR,
        title: title,
        text: text
    }
})

export const warningToast = (text, title="ADEVERTECIA") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    toast: {
        type: toastType.WARNING,
        title: title,
        text: text
    }
})

export const successToast = (text, title="EXITO") => ({
    type: actionType.NEW_TOAST_MESSAGE,
    toast: {
        type: toastType.SUCCESS,
        title: title,
        text: text
    }
})