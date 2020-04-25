import * as services from '../server_connection/services';
import * as action from '../redux/user/userAction';
import {createInfoMessage} from './toast';
import store from '../redux/store';

const USER_SESSION_STORAGE = 'USER_SESSION_STORAGE';

export function login(username, password) {
    return (dispatch) => {
        services.login(username, password)
        .then((userData)=> {
            sessionStorage.setItem(USER_SESSION_STORAGE, JSON.stringify(userData));
            dispatch(action.login(userData));
        })
    }
}

export function logout() {
    return (dispatch) => {
        sessionStorage.clear();
        dispatch(action.logout());
    }
}

function init() {
    console.warn("INIT")
    const userDataJSON  = sessionStorage.getItem(USER_SESSION_STORAGE);
    if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        services.setAuthUser(userData);
        store.dispatch(action.login(userData));
    }
}
init();