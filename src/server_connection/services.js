import axios from 'axios';
import store from '../redux/store';
import * as webSocket from './webSocket';
import * as action from '../redux/user/userAction';
import {DOMAIN_URL} from './config'

const SERVICES_URL = `${DOMAIN_URL}/servicios`;

axios.defaults.baseURL = SERVICES_URL;

export function setAuthUser(user) {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${user.token}` }
}

export function login(cedula, password) {
    return axios.post(`/login`, {
        cedula: cedula,
        password: password
    }).then(res => {
        axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
        return res.data;
    });
}

export function createFile(user, name, padreId=5) {
    return axios.post(`/archivo`, {
        cedulaCreador: user.cedula,
        contenido: "",
        nombre: name,
        directorio: false,
        padreId: padreId,
        editable: true
    }).then(res => res.data)
    .catch((e) => {
        console.warn("Error: Crear Archivo", e)
        throw e;
    })
    .catch(authMiddleWare);
}

function authMiddleWare(e) {
    if(e.request.status === 401) {
        logout();
    }
    throw e;
}

export function logout() {
    store.dispatch(action.logout());
    webSocket.disconnect();
    sessionStorage.clear();
}

export function editFile(fileData) {
   return axios.put(`/archivo/` + fileData.id, fileData)
        .then(res => res.data)
        .catch((e) => {
            console.warn("Error: Editar Archivo", e)
            throw e;
        })
        .catch(authMiddleWare);; 
}

export function getFiles(user) {
    return axios.get(`/archivo?cedula=` + user.cedula)
        .then(res => res.data)
        .catch((e) => {
            console.warn("Error: Get Archivos", e);
            throw e;
        })
        .catch(authMiddleWare);;
}