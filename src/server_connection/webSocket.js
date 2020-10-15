
import {DOMAIN_URL} from './config'

const WEB_SOCKET_URL = `${DOMAIN_URL.replace(/^http/, 'ws')}/endpoint`;

let ws = null;
let lastUserData = null;
const listResponseHandlers = [];
let pendingMessage = []; 

function onMessageHandler(evt) {
    const message = JSON.parse(evt.data)
    if (!message.tipo || message.tipo === 'ack' || message.tipo === 'prompt') { return; }
    if(listResponseHandlers.length > 0) {
        if (typeof message.resultado === 'string'
            && message.resultado.startsWith('IN:') ) {
            console.log(message.resultado);
        } else if (message.resultado === "") {
            const responseHandler = listResponseHandlers.shift(0,1);
            const messages = pendingMessage;
            pendingMessage = []; 
            responseHandler(messages);
        } else {
            pendingMessage.push(message);
        }
    }

   
}

function onOpenHandler(resolve) {
    return () => {
        // on connecting, do nothing but log it to the console
        console.log('connected');
        resolve();
    }
}

function onCloseHandler(e) {
    console.warn('disconnected', e);
    openConnection(lastUserData);
    // automatically try to reconnect on connection loss
}

export function openConnection(userData) {
    if(!userData) return Promise.reject('Not User data');
    return new Promise((resolve) => {
        lastUserData = userData;
        ws = new WebSocket(`${WEB_SOCKET_URL}/${userData.cedula}/${userData.token}/es`);
        ws.onopen = onOpenHandler(resolve);
        ws.onmessage = onMessageHandler;
        ws.onclose = onCloseHandler;
    });
}

export function loadFileCommand(userData, fileId, dependencies) {
    return JSON.stringify({
        token: userData.token,
        load:fileId,
        dependencias: Array.isArray(dependencies) ? [...dependencies, fileId] : dependencies ? [dependencies, fileId] : [fileId]
    })
}

function createCommand(userData, command) {
    return JSON.stringify({
        token: userData.token,
        comando: command
    })
}

export function loadFile(userData, fileId, dependencies) {
    return new Promise((resolve) => {
        listResponseHandlers.push(resolve);
        ws.send(loadFileCommand(userData, fileId, dependencies));
    });
}

export function evalExpression(userData, command) {
    return new Promise((resolve) => {
        listResponseHandlers.push(resolve);
        ws.send(createCommand(userData, command))
    });
}

export function disconnect() {
    lastUserData = null;
    listResponseHandlers.length = 0;
    pendingMessage = [];
    ws.close();
}