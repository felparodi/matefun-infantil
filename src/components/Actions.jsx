import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Consola from './Console';
import { clean } from '../api/board';
import { loadFunctionDefinition, evaluate, saveInMyFunctions } from '../api/matefun';

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

    render() {
        const { openConsole } = this.state;
        const { canProcess, canSaveFunction } = this.props;
        return( 
            <div className="actions">
                <div className="actions-button">
                    <Button variant="primary" onClick={this.clean}>Limpiar</Button>
                    <Button variant="primary" disabled={!canProcess} onClick={this.evaluate}>Evaluar</Button>
                    <Button variant="primary" disabled={!canSaveFunction} onClick={this.saveInMyFunctions}>Guardar en Mis funciones</Button>
                { debugMode && <Button variant="primary" onClick={() => {this.setState({openConsole:!openConsole})}}>Consola</Button> }
                </div>
                { debugMode && <Consola openConsole={openConsole}/> }
            </div>
        );
    }
}


const mapStateToProps = state => ({
    canProcess: state.matrix.canProcess,
    canSaveFunction: state.matrix.canSaveFunction,
    userData: state.user.userData,
    workspaceFileData: state.environment.workspaceFileData,
    myFunctionsFileData: state.environment.myFunctionsFileData,
});

const mapDispatchFunction = {
    loadFunctionDefinition, evaluate, clean, saveInMyFunctions
}

export default connect(mapStateToProps, mapDispatchFunction)(Actions);