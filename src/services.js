import axios from 'axios';

const SERVICES_URL = 'http://localhost:8080/servicios';

//axios.defaults.withCredentials = true;

export function loginInvitado(onSuccess) {

    axios.post(SERVICES_URL + `/login`, {
        cedula: "invitado",
        password: "invitado"
    }).then(res => {
        axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
        onSuccess(res.data);
    }).catch((e) => {
        console.warn("Error:Login Invitado", e)
    })
}

export function crearArchivo(onSuccess) {

    axios.post(SERVICES_URL + `/archivo`, {
        cedulaCreador: "invitado",
        contenido: "",
        nombre: "TestFile",
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