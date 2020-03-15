import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import { process, evaluate, clean, startWork, endWork, processEval } from '../api/board';

const debugMode = localStorage.getItem('debug-mode') === 'true';

export class Actions extends React.Component {
    constructor() {
        super();
        this.state = {
            evaluationResult: '',
            openConsole: false,
        };
        this.process = this.process.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.clean = this.clean.bind(this);
        this.autodummy = this.autodummy.bind(this);
    }

    autodummy() {
        if(this.props.isWorking) {
            this.props.endWork();
        } else {
            this.props.startWork();
        }
    }

    process() {
        this.props.process();
    }

    evaluate() {
        const {isFunction} = this.props;
        if(isFunction) {
            this.props.processEval();
        } else {
            this.props.evaluate();
        }
    }

    clean() {
        this.props.clean();
    }

    renderConsole() {
        const {
            evalInstruction, workspaceFunction, resultEval
        } = this.props;
        const { openConsole } = this.state;
        return (
            <div className={classNames("actions-info", {'hidden':!openConsole})}>
            <p>Evaluar</p>
            <textarea className="info evaluation" readOnly value={evalInstruction}/>
            <p>Funcion</p>
            <textarea className="info function" readOnly value={workspaceFunction}/>
            <p>Resultado</p>
            <textarea className="info result" readOnly value={resultEval}/>
        </div>
        )
    }

    render() {
        const { openConsole } = this.state;
        const { canProcess, isFunction, isWorking} = this.props;
        return( 
            <div className="actions">
                <div className="actions-button">
                    <Button className={classNames({'active':isWorking})} variant="primary" onClick={this.autodummy}>Connectar</Button>
                    <Button variant="primary" onClick={this.clean}>Clean</Button>
                    <Button variant="primary" disabled={!canProcess} onClick={this.evaluate}>Evaluar</Button>
                    
                { debugMode && <Button variant="primary" onClick={() => {this.setState({openConsole:!openConsole})}}>Consola</Button> }
                </div>
                { debugMode && this.renderConsole() }
            </div>
        );
    }
}


const mapStateToProps = state => ({
    canProcess: state.matrix.canProcess,
    isFunction: state.matrix.isFunction,
    evalInstruction: state.matrix.evalInstruction,
    workspaceFunction: state.matrix.workspaceFunction,
    isWorking: state.matrix.isWorking,
    resultEval: state.matrix.resultEval,
});

const mapDispachFunction = {
    process, evaluate, clean, startWork, endWork, processEval
}

export default connect(mapStateToProps, mapDispachFunction)(Actions);