import React from 'react';
import Cell from './Cell'
import Toolbox from './Toolbox'
import Board from './Board'
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import { MatrixPipe } from '../classes/matrix'
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants'
import * as services from '../services';
import './Main.scss';

const debugMode = localStorage.getItem('debug-mode') === 'true';
const matrix = new MatrixPipe(BOARD_ROWS, BOARD_COLS);

export default class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            boardContent: matrix.snapshot(),
            functionDeclaration: '',
            evaluationInstruction: '',
            loadScriptField: '',
            evaluationResult: '',
            waitingForResult: false,
            fileData: {},
            openConsole: false,
            userData: {}
        };
        this.onDrop = this.onDrop.bind(this);
        this.process = this.process.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.onChangeVarValue = this.onChangeVarValue.bind(this);
        this.setResult = this.setResult.bind(this);
        this.onDropToolbox = this.onDropToolbox.bind(this);
    }


    componentDidMount() {

        var userData= this.props.userData;

        this.setState({userData: userData});

        services.crearArchivo(
            (fileData) => {

                this.setState({ fileData: fileData });
            }
        );
        // instance of websocket connection as a class property
        this.ws = new WebSocket('ws://localhost:8080/endpoint' + '/' + userData.cedula + '/' + userData.token + '/es');
        // this.connection = new WebSocket(wsUrl+"/"+cedula+"/"+token+"/"+language);

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

    onDropToolbox(pipe) {
        if (pipe.pos) {
            matrix.removePipe(pipe.pos.x, pipe.pos.y);
            this.setState({
                boardContent: matrix.snapshot(),
            });
        }
    }

    onDrop(row, col, pipeSnap, options) {
        console.log('onDrop', Date.now());
        if (pipeSnap) {
            if (pipeSnap.pos && !options.isCopy) {
                matrix.moverPipe(row, col, pipeSnap.pos);
            } else {
                matrix.addPipeSnap(row, col, pipeSnap);
            }
        } else {
            matrix.removePipe(row, col);
        }
        this.setState({
            boardContent: matrix.snapshot(),
        });
    }

    onChangeVarValue(x, y, value) {
        matrix.setPipeValue(x, y, value);
        this.setState({
            boardContent: matrix.snapshot()
        });
    }

    process() {
        var functionDeclaration = matrix.process();
        if (functionDeclaration.isFunction) {
            this.setState({ functionDeclaration: functionDeclaration.body })
            var fileData = this.state.fileData;
            fileData.contenido = functionDeclaration.body;
            services.editarArchivo(fileData,
                (response) => {
                    var userData = this.state.userData;
                    this.ws && this.ws.send('{"token":"' + userData.token + '","load":' + fileData.id + ',"dependencias":[' + fileData.id + ']}');
                }
            );
        } else {
            this.setState({ evaluationInstruction: functionDeclaration.body }, () =>
                this.ws &&
                this.ws.send('{"token":"' + this.state.userData.token + '","comando":"' + functionDeclaration.body + '"}')
            );
        }
    }

    evaluate() {
        //@TODO Cuando no es funcion
        var evaluationInstruction = matrix.evaluateFunction();
        this.setState({
            evaluationInstruction: evaluationInstruction,
            waitingForResult: true
        }, () => {
            this.ws &&
                this.ws.send('{"token":"' + this.state.userData.token + '","comando":"' + evaluationInstruction + '"}'); //send data to the server
        })

    }

    setResult() {
        matrix.setResultValue(5);
        this.setState({ boardContent: matrix.snapshot() });
    }

    renderConsole() {
        const {
            functionDeclaration, evaluationInstruction,
            loadScriptField, evaluationResult, openConsole
        } = this.state;
        return (
            <div className={classNames("actions-info", { 'hidden': !openConsole })}>
                <p>Evaluar</p>
                <textarea className="info evaluation" readOnly value={evaluationInstruction} />
                <p>Funcion</p>
                <textarea className="info function" readOnly value={functionDeclaration} />
                <p>Archivo</p>
                <textarea className="info file" readOnly value={loadScriptField} />
                <p>Resultado</p>
                <textarea className="info result" readOnly value={evaluationResult} />
            </div>
        )
    }

    render() {
        const { boardContent, openConsole } = this.state;
        return (
            <div className="Main">
                <Header userData={this.state.userData} onLogout={this.props.onLogout}/>
                <div className="container">
                    <div className="body">
                        <div className="toolbox-container">
                            <Toolbox onDrop={this.onDropToolbox} />
                        </div>
                        <div className="board-container">
                            <Board content={boardContent.board} onDrop={this.onDrop} onChangeVarValue={this.onChangeVarValue} />
                        </div>
                    </div>
                    <div className="actions">
                        <div className="actions-button">
                            <Button variant="primary" disabled={!boardContent.canProcess || (boardContent.isFunction && !boardContent.canFuncEval)} onClick={this.evaluate}>Evaluar</Button>
                            <Button variant="primary" disabled={!boardContent.canProcess || !boardContent.isFunction} onClick={this.process}>Procesar</Button>
                            {debugMode && <Button variant="primary" onClick={() => { this.setState({ openConsole: !openConsole }) }}>Consola</Button>}
                        </div>
                        {debugMode && this.renderConsole()}
                    </div>
                </div>
            </div>
        )
    }
}