import axios from 'axios';
import {DOMAIN_URL} from './config'

const SERVICES_URL = `http://${DOMAIN_URL}/servicios`;

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
    }).catch((e) => {
        console.warn("Error:Login Invitado", e)
    });
}

export function createFile(user, name) {
    return axios.post(`/archivo`, {
        cedulaCreador: user.cedula,
        contenido: "",
        nombre: name,
        directorio: false,
        padreId: 5,
        editable: true
    }).then(res => res.data)
    .catch((e) => {
        console.warn("Error:Crear Archivo", e)
        throw e;
    });
}


export function editFile(fileData) {
   return axios.put(`/archivo/` + fileData.id, fileData)
        .then(res => res.data)
        .catch((e) => {
            console.warn("Error:Editar Archivo", e)
            throw e;
        }); 
}

export function getFiles(user) {
    return axios.get(`/archivo?cedula=` + user.cedula)
        .then(res => res.data)
        .catch((e) => {
            console.warn("Error:Get Archivos", e);
            throw e;
        });
}