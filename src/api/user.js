import * as services from '../server_connection/services';
import * as action from '../redux/user/userAction';
import * as board from './board';
import {createErrorMessage} from './toast';
import store from '../redux/store';

const USER_SESSION_STORAGE = 'USER_SESSION_STORAGE';

export function login(username, password) {
    return (dispatch) => {
        services.login(username, password)
        .then((userData)=> {
            if(userData) {
                sessionStorage.setItem(USER_SESSION_STORAGE, JSON.stringify(userData));
                dispatch(action.login(userData));
            }
        })
        .catch(() => {
            createErrorMessage('Error al iniciar session, revice sus credenciales')
        })
    }
}

export function logout() {
    return (dispatch) => {
        board.restartCompiler(dispatch);
        dispatch(action.logout());
        sessionStorage.clear();
    }
}

function init() {
    const userDataJSON  = sessionStorage.getItem(USER_SESSION_STORAGE);
    if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        services.setAuthUser(userData);
        store.dispatch(action.login(userData));
    }
}
init();