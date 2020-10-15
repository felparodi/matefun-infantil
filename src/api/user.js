import * as services from '../server_connection/services';
import * as webSocket from '../server_connection/webSocket';
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
                board.restartCompiler(dispatch);
                sessionStorage.setItem(USER_SESSION_STORAGE, JSON.stringify(userData));
                dispatch(action.login(userData));
            }
        })
        .catch(() => {
            createErrorMessage('Error al iniciar session, revise sus credenciales')
        })
    }
}

export function logout() {
    return (dispatch) => {
        services.logout();
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