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
import * as board from '../api/board';
import './Main.scss';

const debugMode = localStorage.getItem('debug-mode') === 'true';

export default class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            boardContent: board.getSnapshot(),
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
        this.onDropToolbox = this.onDropToolbox.bind(this);
    }

    componentDidMount() {
        services.loginInvitado();
    }

    onDropToolbox(pipe) {
        board.removePipe(pipe);
        this.setState({
            boardContent: board.getSnapshot(),
        });
    }

    onDrop(row, col, pipeSnap, options) {
        console.log('onDrop', Date.now());
        if (pipeSnap) {
            if(pipeSnap.pos && !options.isCopy) {
                board.moverPipe(row, col, pipeSnap);
            } else {
                board.addPipeSnap(row, col, pipeSnap);
            }
            this.setState({
                boardContent: board.getSnapshot(),
            });
        }
    }

    onChangeVarValue(x, y, value) {
        board.setPipeValue(x, y, value);
        this.setState({ boardContent: board.getSnapshot() });
    }

    process() {
        const functionDeclaration = board.process();
        if (functionDeclaration.isFunction) {
            this.setState({ functionDeclaration: functionDeclaration.body })
            services.editarWorkspace(functionDeclaration.body);
        }
    }

    evaluate() {
        var evaluationInstruction = board.evaluate();
        this.setState({ evaluationInstruction: evaluationInstruction })
        services.sendCommand(evaluationInstruction)
            .then((message) => {
                board.setMateFunValue(message);
                this.setState({ 
                    boardContent: board.getSnapshot()
                });
            });
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

    renderActions() {
        const { boardContent, openConsole } = this.state;
        return( 
            <div className="actions">
                <div className="actions-button">
                    <Button variant="primary" disabled={!boardContent.canProcess || (boardContent.isFunction && !boardContent.canFuncEval)} onClick={this.evaluate}>Evaluar</Button>
                    <Button variant="primary" disabled={!boardContent.canProcess || !boardContent.isFunction} onClick={this.process}>Procesar</Button>
                { debugMode && <Button variant="primary" onClick={() => {this.setState({openConsole:!openConsole})}}>Consola</Button> }
                </div>
                { debugMode && this.renderConsole() }
            </div>
        );
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
                   {this.renderActions()}
                </div>
            </div>
        )
    }
}