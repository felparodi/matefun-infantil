import React from 'react';
import { connect } from 'react-redux';

import Toolbox from './Toolbox'
import Board from './Board'
import Actions from './Actions';
import Header from './Header';
import * as services from '../services';
import * as webSocket from '../webSocket';

import './Main.scss';

export class Main extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

        var userData = this.props.userData;

        this.setState({ userData: userData });

        services.getArchivos(userData.cedula, (files) => {
            var workspaceFileData = files.find((file) => file.nombre == 'Workspace');
            if (typeof lastname !== "undefined") {
                this.setState({ workspaceFileData: workspaceFileData })
            } else {
                services.crearArchivo("Workspace",
                    (workspaceFileData) => {

                        this.setState({ workspaceFileData: workspaceFileData });
                    }
                );
            }
            var myFunctionsFileData = files.find((file) => file.nombre == 'MyFunctions');
            if (typeof myFunctionsFileData !== "undefined") {
                this.setState({ myFunctionsFileData: myFunctionsFileData })
            } else {
                services.crearArchivo("MyFunctions",
                    (myFunctionsFileData) => {

                        this.setState({ myFunctionsFileData: myFunctionsFileData });
                    }
                );
            }
        })


        this.ws = webSocket.abrirConexion(userData);

        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }

        this.ws.onmessage = evt => {
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

        }

        this.ws.onclose = () => {
            console.warn('disconnected')
            // automatically try to reconnect on connection loss
        }

    }

    render() {
        return (
            <div className="Main">
                <Header />
                <div className="container">
                    <div className="body">
                        <div className="toolbox-container">
                            <Toolbox onDrop={this.onDropToolbox} />
                        </div>
                        <div className="board-container">
                            <Board />
                        </div>
                    </div>
                    <Actions />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);
