import axios from 'axios';
import { useCallback } from 'react';

const DOMMAIN_URL = 'localhost:8080'
const SERVICES_URL = `http://${DOMMAIN_URL}/servicios`;
const SOCKET_URL = `ws://${DOMMAIN_URL}/endpoint`;

//Name Of matefun FIle
const DEFAULT_ROOT_FILE_ID = 5;
const WORKSPACE_FILE_NAME = 'MateFun Infatil Workspace';
const CUSTOM_FUNCTION_FILE_NAME = 'MateFun Infatil Custom Function';

//WebSockt Reference
let ws = null
const wsResponse = [];
const wsOnClose = [];

//Dinamicy Matefun Data
let userData  = null;
let workspaceFile = null;
let customFuctionFile = null;

//axios.defaults.withCredentials = true;

export function loginInvitado() {
    return login("invitado", "invitado")
}

//Creare si no existe los archivos basicos para trabajar en matefun
function affetrLogin(user=userData) {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${user.token}` }
    createWebSocket(userData);
    getArchios()
        .then((files) => {
            workspaceFile = files.find((file) => file.nombre === WORKSPACE_FILE_NAME)
            if(!workspaceFile) crearWorkspaceFile();
            customFuctionFile = files.find((file) => file.nombre === CUSTOM_FUNCTION_FILE_NAME)
            if(!customFuctionFile) crearCustomFuctinoFile();
        }
    )
}

export function login(username, password) {
   return axios.post(SERVICES_URL + `/login`, {
        cedula: username,
        password: password
    }).then(res => {
        debugger;
        userData = res.data;
        affetrLogin(userData);
        return res.data;
    }).catch((e) => {
        console.warn("Error:Login Invitado", e)
    })
}

function createWebSocket(userData) {
    ws = new WebSocket(`${SOCKET_URL}/${userData.cedula}/${userData.token}/es`);
    ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected')
    }

    ws.onmessage = evt => {
        // listen to data sent from the websocket server
        if(wsResponse.length > 0) {
            const message = JSON.parse(evt.data)
            if (!message.tipo || message.tipo === 'ack') { return; }
            const res = wsResponse.shift();
            if(message.tipo === 'salida') {
                res.success(message);
            } else if(message.tipo === 'error') {
                res.error(message);
            }
        }
    }

    ws.onclose = () => {
        console.warn('disconnected')
        wsOnClose.forEach((calback) => calback());
    }
}

export function editarWorkspace(contenido) {
    workspaceFile.contenido = contenido;
    editarArchivo2(workspaceFile)
        .then((fileData) => {
            workspaceFile = fileData;
            return uplaodFile(workspaceFile)
                .then((message) => {
                    console.log(message);
                    return fileData;
                })
        })
   
}

export function getArchios(user=userData) {
    return axios.get(SERVICES_URL + `/archivo`, {params:{
        cedula:user.cedula
    }}).then((res) => {
        return res.data;
    })
}

export function sendCommand(comando) {
    return sendInstruction({comando});
}

function uplaodFile(fileData, extraDep = []) {
    return sendInstruction({load: fileData.id, dependencias: [...extraDep, fileData.id]})
}

function sendInstruction(instr) {
    return new Promise((res, rejec) => {
        wsResponse.push({success: res, error:rejec});
        ws.send(JSON.stringify({ token: userData.token, ...instr }));
    });
}

function crearWorkspaceFile() {
    return crearArchivo(WORKSPACE_FILE_NAME)
        .then(data => {
            workspaceFile = data;
            return data;
        })
}

function crearCustomFuctinoFile() {
    return crearArchivo(CUSTOM_FUNCTION_FILE_NAME)
        .then(data => {
            customFuctionFile = data;
            return data;
        })
}

export function crearArchivo(name, user=userData) {
    return axios.post(SERVICES_URL + `/archivo`, {
        cedulaCreador: user.cedula,
        contenido: "",
        nombre: name,
        directorio: false,
        padreId: DEFAULT_ROOT_FILE_ID,
        editable: true
    }).then(res => res.data)
    .catch((e) => {
        console.warn("Error:Crear Archivo", e)
    })
}

export function editarArchivo(fileData, onSuccess) {
    editarArchivo2(fileData).then(onSuccess);
}

export function editarArchivo2(fileData) {
    return axios.put(SERVICES_URL + `/archivo/` + fileData.id, fileData)
        .then(res => res.data);
}
