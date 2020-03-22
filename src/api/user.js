import * as services from '../server_connection/services';
import { login, logout } from '../redux/user/userAction';


export function loginInvitado() {
    return (dispatch) => {
        services.login("invitado", "invitado", ()=> {
            dispatch(login(userData));
        })
    }
}

export function logout() {
    return (dispatch) => {
        dispatch(logout())
    }
}