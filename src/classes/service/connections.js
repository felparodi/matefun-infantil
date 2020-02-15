
const DOMAIN = 'localhost:8080';

class WebSocketMatefun {

    constructor(userData) {
        // instance of websocket connection as a class property
        this.ws = new WebSocket(`ws://${DOMAIN}/endpoint/${userData.cedula}/${userData.token}/es`);
        // this.connection = new WebSocket(wsUrl+"/"+cedula+"/"+token+"/"+language);
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }
        //Clean function
        this.onMenssage = () => {};
        
        this.ws.onmessage = evt => {
            // listen to data sent from the websocket server
            const message = JSON.parse(evt.data)
            if (this.state.waitingForResult && message.tipo=="salida" && message.resultado.startsWith("OUT")){
                var resultValue= message.resultado.substring(3);
                
                var boardContent= this.state.boardContent;
                boardContent.setResultValue(resultValue);

                this.setState({ 
                    waitingForResult: false,
                    boardContent: boardContent.clone()
                    //boardContent: boardContent
                });
            }
        }
        
        this.ws.onclose = () => {
            console.warn('disconnected')
            // automatically try to reconnect on connection loss
        }
    }
}