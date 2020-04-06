import * as services from '../server_connection/services';
import { login, logout } from '../redux/user/userAction';


export function loginInvitado() {
    return (dispatch) => {
        services.login("invitado", "invitado")
        .then((userData)=> {
            dispatch(login(userData));
        })
    }
}

export function logout2() {
    return (dispatch) => {
        dispatch(logout());
    }
}