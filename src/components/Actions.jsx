import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Consola from './Console';
import { clean, cancelEdit } from '../api/board';
import CreateFunction from './modal/CreateFunction';
import { loadFunctionDefinition, evaluate, saveCustomFunction } from '../api/matefun';
import Icon from '../components/Icon';
import * as icon from '../constants/icons';

const debugMode = localStorage.getItem('debug-mode') === 'true';

export class Actions extends React.Component {
    constructor() {
        super();
        this.state = {
            evaluationResult: '',
            openConsole: false,
            openSaveFunction: false,
        };
        this.loadFunctionDefinition = this.loadFunctionDefinition.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.clean = this.clean.bind(this);
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

    render() {
        const { openConsole, openSaveFunction  } = this.state;
        const { canProcess, canSaveFunction, isEditMode, editFuncName } = this.props;
        return( 
            <div className="Actions">
                <div className="action-buttons">
                    { !isEditMode &&    
                        <Button className="mf-button-primary ml-1" onClick={this.clean}>
                            <Icon icon={icon.CLEAN}/>Limpiar
                        </Button> 
                    }
                    { isEditMode && 
                        <Button className="mf-button-primary ml-1" onClick={this.props.cancelEdit}>
                            Cancel
                        </Button> 
                    }
                    { !isEditMode && 
                        <Button className="mf-button-primary ml-1" disabled={!canSaveFunction} onClick={() => this.setState({openSaveFunction: true})}>
                            <Icon icon={icon.SAVE}/> Guardar
                        </Button>
                    }
                    { isEditMode &&    
                        <Button className="mf-button-primary ml-1" disabled={!canSaveFunction} onClick={() => this.props.saveCustomFunction(editFuncName)}>
                            <Icon icon={icon.SAVE}/> Guardar
                        </Button>
                    }
                    { isEditMode && 
                        <Button variant="primary" disabled={!canSaveFunction} onClick={() => this.setState({openSaveFunction: true})}>
                            <Icon icon={icon.SAVE}/> Guardar como...
                        </Button> 
                    }
                    <Button className="mf-button-primary ml-1" disabled={!canProcess} onClick={this.evaluate}>
                        <Icon icon={icon.PLAY}/> Probar
                    </Button>
           
                </div>
                <CreateFunction show={openSaveFunction} onHide={() => this.setState({openSaveFunction: false})}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    canProcess: state.matrix.canProcess,
    canSaveFunction: state.matrix.canSaveFunction,
    userData: state.user.userData,
    isEditMode: state.matrix.isEditMode,
    editFuncName: state.matrix.editFuncName,
});

const mapDispatchFunction = {
    loadFunctionDefinition, evaluate, clean, saveCustomFunction, cancelEdit
}

export default connect(mapStateToProps, mapDispatchFunction)(Actions);