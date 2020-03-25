import { LOGIN, LOGOUT } from './userActionTypes'

export const login = (userData) => {
    return {
        type: LOGIN,
        payload: userData
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}