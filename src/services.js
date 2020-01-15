import axios from 'axios';

const SERVICES_URL = 'http://localhost:8080/servicios';


export function loginInvitado(onSuccess) {

    axios.post(SERVICES_URL + `/login`, {
        cedula: "invitado",
        password: "invitado"
    }).then(res => {

        axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }

        onSuccess(res.data);
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
    })
}


export function editarArchivo(fileData, onSuccess) {

    axios.put(SERVICES_URL + `/archivo/` + fileData.id, fileData)
        .then(res => {
            onSuccess(res.data);
        })
}