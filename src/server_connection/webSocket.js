
import {DOMAIN_URL} from './config'

const WEB_SOCKET_URL = `ws://${DOMAIN_URL}/endpoint`;

let ws = null;
const listResponseHandlers = [];
let pendingMessage = []; 

function onMessageHandler(evt) {
    const message = JSON.parse(evt.data)
    if (!message.tipo || message.tipo === 'ack') { return; }
    if(listResponseHandlers.length > 0) {
        if (message.resultado === "") {
            const responseHandler = listResponseHandlers.shift(0,1);
            const messages = pendingMessage;
            pendingMessage = []; 
            responseHandler(messages);
        } else {
            pendingMessage.push(message);
        }
    }

   
}

function onOpenHandler() {
    // on connecting, do nothing but log it to the console
    console.log('connected')
}

function onCloseHandler() {
    console.warn('disconnected')
    // automatically try to reconnect on connection loss
}

export function abrirConexion(userData) {
    ws = new WebSocket(`${WEB_SOCKET_URL}/${userData.cedula}/${userData.token}/es`);
    ws.onopen = onOpenHandler;
    ws.onmessage = onMessageHandler;
    ws.onclose = onCloseHandler;
}

export function loadFileCommand(userData, fileId, dependencies) {
    return JSON.stringify({
        token: userData.token,
        load:fileId,
        dependencias: Array.isArray(dependencies) ? dependencies : [dependencies]
    })
}

export function evalExpressionCommand(userData, command) {
    return JSON.stringify({
        token: userData.token,
        comando: command
    })
}

export function cargarArchivo(userData, fileId, dependencies) {
    return new Promise((resolve) => {
        listResponseHandlers.push(resolve);
        ws.send(loadFileCommand(userData, fileId, dependencies));
    });
}

export function evaluarExpresion(userData, command) {
    return new Promise((resolve) => {
        listResponseHandlers.push(resolve);
        ws.send(evalExpressionCommand(userData, command))
    });
} 