
import {DOMAIN_URL} from './config'

const WEB_SOCKET_URL = `ws://${DOMAIN_URL}/endpoint`;

let ws = null;
const listResponsHandelrs = [];
let penddigMessage = []; 

function onMessageHandler(evt) {
    const message = JSON.parse(evt.data)
    if (!message.tipo || message.tipo === 'ack') { return; }
    if(listResponsHandelrs.length > 0) {
        if (message.resultado === "") {
            const responseHandelr = listResponsHandelrs.shift(0,1);
            const messages = penddigMessage;
            penddigMessage = []; 
            responseHandelr(messages);
        } else {
            penddigMessage.push(message);
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
    debugger;
}

export function loadFileCommand(userData, fileId, dependencias) {
    return JSON.stringify({
        token: userData.token,
        load:fileId,
        dependencias: Array.isArray(dependencias) ? dependencias : [dependencias]
    })
}

export function evallExprecionCommand(userData, expresion) {
    return JSON.stringify({
        token: userData.token,
        comando: expresion
    })
}

export function cargarArchivo(userData, fileId, dependencias) {
    return new Promise((resolve) => {
        listResponsHandelrs.push(resolve);
        ws.send(loadFileCommand(userData, fileId, dependencias));
    });
}

export function evaluarExpresion(userData, expresion) {
    return new Promise((resolve) => {
        listResponsHandelrs.push(resolve);
        ws.send(evallExprecionCommand(userData, expresion))
    });
} 