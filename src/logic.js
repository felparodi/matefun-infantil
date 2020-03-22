import * as services from './server_connection/services';
import * as webSocket from './server_connection/webSocket';
import { WORKSPACE_FILE_NAME, MYFUNCTIONS_FILE_NAME } from './constants/constants'
import store from './redux/store'
import updateBoard from './redux/matrix/matrixAction'


export function prepareEnvironment(userData, onSuccess) {

    services.getArchivos(userData.cedula, (files) => {
        
        var workspaceFileData = files.find((file) => file.nombre == WORKSPACE_FILE_NAME);
        if (typeof workspaceFileData !== "undefined") {
            //this.setState({ workspaceFileData: workspaceFileData })
        } else {
            services.crearArchivo(WORKSPACE_FILE_NAME,
                (workspaceFileData) => {
                    workspaceFileData= workspaceFileData;
                    //this.setState({ workspaceFileData: workspaceFileData });
                }
            );
        }
        var myFunctionsFileData = files.find((file) => file.nombre == MYFUNCTIONS_FILE_NAME);
        if (typeof myFunctionsFileData !== "undefined") {
            //this.setState({ myFunctionsFileData: myFunctionsFileData })
        } else {
            services.crearArchivo(MYFUNCTIONS_FILE_NAME,
                (myFunctionsFileData) => {
                    myFunctionsFileData= myFunctionsFileData;    
                    //this.setState({ myFunctionsFileData: myFunctionsFileData });
                }
            );
        }
        onSuccess(workspaceFileData, myFunctionsFileData);
    })

    webSocket.abrirConexion(userData);
}

const onMessage= evt => {
    // listen to data sent from the websocket server
    //if (this.state.waitingForResult) {
        const message = JSON.parse(evt.data)
        if (!message.tipo || message.tipo === 'ack') { return; }
        matrix.setMateFunValue(message);
        
        store.dispatch(updateBoard(matrix.snapshot()));
          

    }
        /*
        this.setState({
            waitingForResult: false,
            boardContent: matrix.snapshot()
            //boardContent: boardContent
        }, () => console.log('hey'))
        */
    //}

}