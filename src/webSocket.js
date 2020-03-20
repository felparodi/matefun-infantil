const WEB_SOCKET_URL = 'ws://localhost:8080/endpoint';

let ws = null;

export function abrirConexion(userData) {

    ws= new WebSocket(WEB_SOCKET_URL + '/' + userData.cedula + '/' + userData.token + '/es');
}

export function cargarArchivo(userData, workspaceFileId, myfunctionsFileId) {

    ws.send('{"token":"' + userData.token + '","load":' + workspaceFileId + ',"dependencias":[' + workspaceFileId +
        ',' + myfunctionsFileId + ']}');
}

export function evaluarExpresion(userData, expresion) {

    ws.send('{"token":"' + userData.token + '","comando":"' + expresion + '"}')
} 