import React from 'react';
import {connect} from 'react-redux';
import Cell from './Cell'
import Toolbox from './Toolbox'
import Board from './Board'
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import * as services from '../services';
import { process, evaluate } from '../api/board';
import './Main.scss';

const debugMode = localStorage.getItem('debug-mode') === 'true';

export class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            evaluationResult: '',
            openConsole: false,
            userData: {}
        };
        this.process = this.process.bind(this);
        this.evaluate = this.evaluate.bind(this);
    }

    componentDidMount() {
        services.loginInvitado();
    }


    process() {
        this.props.process();
    }

    evaluate() {
        this.props.evaluate();
    }

    renderConsole() {
        const {
            evalInstruction, workspaceFunction
        } = this.props;
        const { 
             evaluationResult, openConsole
        } = this.state;
        return (
            <div className={classNames("actions-info", {'hidden':!openConsole})}>
            <p>Evaluar</p>
            <textarea className="info evaluation" readOnly value={evalInstruction}/>
            <p>Funcion</p>
            <textarea className="info function" readOnly value={workspaceFunction}/>
            <p>Resultado</p>
            <textarea className="info result" readOnly value={evaluationResult}/>
        </div>
        )
    }

    renderActions() {
        const { openConsole } = this.state;
        const {canProcess, isFunction} = this.props;
        return( 
            <div className="actions">
                <div className="actions-button">
                    <Button variant="primary" disabled={!canProcess} onClick={this.evaluate}>Evaluar</Button>
                    <Button variant="primary" disabled={!isFunction} onClick={this.process}>Procesar</Button>
                { debugMode && <Button variant="primary" onClick={() => {this.setState({openConsole:!openConsole})}}>Consola</Button> }
                </div>
                { debugMode && this.renderConsole() }
            </div>
        );
    }
    render() {
        return (
            <div className="Main">
                <Header userData={this.state.userData} onLogout={this.props.onLogout}/>
                <div className="container">
                    <div className="body">
                        <div className="toolbox-container">
                            <Toolbox onDrop={this.onDropToolbox} />
                        </div>
                        <div className="board-container">
                            <Board/>
                        </div>
                    </div>
                   {this.renderActions()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    canProcess: state.matrix.canProcess,
    isFunction: state.matrix.isFunction,
    evalInstruction: state.matrix.evalInstruction,
    workspaceFunction: state.matrix.workspaceFunction
});

const mapDispachFunction = {
    process, evaluate
}

export default connect(mapStateToProps, mapDispachFunction)(Main);
