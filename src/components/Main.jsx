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
        services.loginInvitado();
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
            services.editarWorkspace(functionDeclaration.body);
        }
    }

    evaluate() {
        //@TODO Cuando no es funcion
        var evaluationInstruction = matrix.evaluateFunction();
        this.setState({ evaluationInstruction: evaluationInstruction })
        services.sendCommand(evaluationInstruction)
            .then((message) => {
                debugger
                matrix.setMateFunValue(message);
                this.setState({ 
                    boardContent: matrix.snapshot()
                });
            });
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