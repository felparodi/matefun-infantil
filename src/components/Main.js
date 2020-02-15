import React from 'react';
import Cell from './Cell'
import Toolbox from './Toolbox.js'
import Board from './Board.js'
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import Header from './Header';
import { MatrixPipe } from '../classes/matrix'
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants'
import * as services from '../services';
import './Main.scss';


const debugMode = localStorage.getItem('debug-mode') === 'true';


export default class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            boardContent: new MatrixPipe(BOARD_ROWS, BOARD_COLS),
            functionDeclaration: '',
            evaluationInstruction: '',
            loadScriptField: '',
            evaluationResult: '',
            waitingForResult: false,
            fileData: {},
            openConsole: false,
        };
        this.onDrop = this.onDrop.bind(this);
        this.process = this.process.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.onChangeVarValue = this.onChangeVarValue.bind(this);
        this.setResult= this.setResult.bind(this);
    }


    componentDidMount() {

        services.loginInvitado(
            (userData) => {

                this.setState({ userData: userData });

                services.crearArchivo(
                    (fileData) => {

                        this.setState({ fileData: fileData });
                    });
                // instance of websocket connection as a class property
                this.ws = new WebSocket('ws://localhost:8080/endpoint' + '/' + userData.cedula + '/' + userData.token + '/es');
                // this.connection = new WebSocket(wsUrl+"/"+cedula+"/"+token+"/"+language);

                this.ws.onopen = () => {
                    // on connecting, do nothing but log it to the console
                    console.log('connected')
                }

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
                        },()=>console.log('hey'))
                    }
                }

                this.ws.onclose = () => {
                    console.warn('disconnected')
                    // automatically try to reconnect on connection loss
                }

            });
    }

    onDrop(row, col, pipe) {
        console.log('onDrop', Date.now());
        var boardContent = this.state.boardContent;
        boardContent.addPipe(row, col, pipe.clone());
        this.setState({
            boardContent: boardContent
        });
    }

    onChangeVarValue(x, y, value) {
        var boardContent = this.state.boardContent;

        boardContent.setPipeValue(x, y, value);

        this.setState({
            boardContent: boardContent
        });
    }

    process() {
        var boardContent = this.state.boardContent;

        var functionDeclaration = boardContent.process();
        this.setState({
            functionDeclaration: functionDeclaration
        })

        var fileData = this.state.fileData;

        fileData.contenido = functionDeclaration;

        services.editarArchivo(fileData,
            (response) => {

                var userData = this.state.userData;

                this.ws && this.ws.send('{"token":"' + userData.token + '","load":' + fileData.id + ',"dependencias":[' + fileData.id + ']}');
            })
    }

    evaluate() {
        var boardContent = this.state.boardContent;

        var evaluationInstruction = boardContent.evaluateFunction();
        
        this.setState({
            evaluationInstruction: evaluationInstruction,
            waitingForResult: true
        }, () => {
            this.ws.send('{"token":"' + this.state.userData.token + '","comando":"' + evaluationInstruction + '"}'); //send data to the server
        })

    }

    setResult() {
        var boardContent = this.state.boardContent;

        boardContent.setResultValue(5);

        this.setState({boardContent: boardContent});
    }

    render() {
        const { boardContent, openConsole, 
            functionDeclaration, evaluationInstruction, 
            loadScriptField, evaluationResult 
        } = this.state;
        return (
            <div className="Main">
                <Header/>
                <div className="container">
                    <div className="body">
                        <div className="toolbox-container">
                            <Toolbox />
                        </div>
                        <div className="board-container">
                            <Board content={boardContent} onDrop={this.onDrop} onChangeVarValue={this.onChangeVarValue} />
                        </div>
                    </div>
                    <div className="actions">
                        <div className="actions-button">
                            <Button variant="primary" onClick={this.evaluate}>Evaluar</Button>
                            <Button variant="primary" onClick={this.process}>Procesar</Button>
                        { debugMode && <Button variant="primary" onClick={() => {this.setState({openConsole:!openConsole})}}>Consola</Button> }
                        </div>
                        { debugMode &&
                             <div className={classNames("actions-info", {'hidden':!openConsole})}>
                                <p>Evaluar</p>
                                <textarea className="info evaluation" readOnly value={evaluationInstruction}/>
                                <p>Funcion</p>
                                <textarea className="info function" readOnly value={functionDeclaration}/>
                                <p>Archivo</p>
                                <textarea className="info file" readOnly value={loadScriptField} />
                                <p>Resultado</p>
                                <textarea className="info result" readOnly value={evaluationResult}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}