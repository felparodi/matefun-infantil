import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import { loadFunctionDefinition, evaluate, clean, saveInMyFunctions } from '../api/board';

const debugMode = localStorage.getItem('debug-mode') === 'true';

export class Actions extends React.Component {
    constructor() {
        super();
        this.state = {
            evaluationResult: '',
            openConsole: false,
        };
        this.loadFunctionDefinition = this.loadFunctionDefinition.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.clean = this.clean.bind(this);
        this.saveInMyFunctions = this.saveInMyFunctions.bind(this);
    }

    loadFunctionDefinition() {
        this.props.loadFunctionDefinition(this.props.userData, this.props.workspaceFileData, this.props.myFunctionsFileData);
    }

    evaluate() {
        this.props.evaluate(this.props.userData);
    }

    clean() {
        this.props.clean();
    }

    saveInMyFunctions() {
        this.props.saveInMyFunctions(this.props.userData, this.props.workspaceFileData, this.props.myFunctionsFileData);
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

    render() {
        const { openConsole } = this.state;
        const { canProcess, isFunction} = this.props;
        return( 
            <div className="actions">
                <div className="actions-button">
                    <Button variant="primary" disabled={!canProcess} onClick={this.evaluate}>Evaluar</Button>
                    <Button variant="primary" disabled={!isFunction} onClick={this.loadFunctionDefinition}>Cargar funcion</Button>
                    <Button variant="primary" onClick={this.clean}>Clean</Button>
                { debugMode && <Button variant="primary" onClick={() => {this.setState({openConsole:!openConsole})}}>Consola</Button> }
                </div>
                <div className="actions-button">
                    <Button variant="primary" onClick={this.saveInMyFunctions}>Guardar en Mis funciones</Button>
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
    userData: state.user.userData,
    workspaceFileData: state.environment.workspaceFileData,
    myFunctionsFileData: state.environment.myFunctionsFileData,
});

const mapDispachFunction = {
    loadFunctionDefinition, evaluate, clean, saveInMyFunctions
}

export default connect(mapStateToProps, mapDispachFunction)(Actions);