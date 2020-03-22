import axios from 'axios';
import {DOMAIN_URL} from './config'

const SERVICES_URL = `http://${DOMAIN_URL}/servicios`;


export function login(cedula, password, onSuccess) {

    axios.post(SERVICES_URL + `/login`, {
        cedula: cedula,
        password: password
    }).then(res => {
        axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
        onSuccess(res.data);
    }).catch((e) => {
        console.warn("Error:Login Invitado", e)
    })
}

export function crearArchivo(nombre, onSuccess) {

    axios.post(SERVICES_URL + `/archivo`, {
        cedulaCreador: "invitado",
        contenido: "",
        nombre: nombre,
        directorio: false,
        padreId: 5,
        editable: true
    }).then(res => {
        onSuccess(res.data);
    }).catch((e) => {
        console.warn("Error:Crear Archivo", e)
    })
}


export function editarArchivo(fileData, onSuccess) {

    axios.put(SERVICES_URL + `/archivo/` + fileData.id, fileData)
        .then(res => {
            onSuccess(res.data);
        }).catch((e) => {
            console.warn("Error:Editar Archivo", e)
        })
}

export function getArchivos(cedula, onSuccess) {

    axios.get(SERVICES_URL + `/archivo?cedula=` + cedula)
        .then(res => {
            onSuccess(res.data);
        }).catch((e) => {
            console.warn("Error:Get Archivos", e)
        })
}