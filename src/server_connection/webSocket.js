
import {DOMAIN_URL} from './config'

const WEB_SOCKET_URL = `ws://${DOMAIN_URL}/endpoint`;

let ws = null;

export function abrirConexion(userData, onMessage) {

    ws= new WebSocket(WEB_SOCKET_URL + '/' + userData.cedula + '/' + userData.token + '/es');

    ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected')
    }

    ws.onmessage = onMessage;
    
    //evt => {
        
      //  console.log(evt);
        /*
        // listen to data sent from the websocket server
        if (this.state.waitingForResult) {
            const message = JSON.parse(evt.data)
            if (!message.tipo || message.tipo === 'ack') { return; }
            matrix.setMateFunValue(message);
            
            this.setState({
                waitingForResult: false,
                boardContent: matrix.snapshot()
                //boardContent: boardContent
            }, () => console.log('hey'))
        }
        */

    //}
    

    ws.onclose = () => {
        console.warn('disconnected')
        // automatically try to reconnect on connection loss
    }
}

export function cargarArchivo(userData, workspaceFileId, myfunctionsFileId) {

    ws.send('{"token":"' + userData.token + '","load":' + workspaceFileId + ',"dependencias":[' + workspaceFileId +
        ',' + myfunctionsFileId + ']}');
}

export function evaluarExpresion(userData, expresion) {

    ws.send('{"token":"' + userData.token + '","comando":"' + expresion + '"}')
} 