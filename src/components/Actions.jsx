import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { clean, cancelEdit } from '../api/board';
import CreateFunction from './modal/CreateFunction';
import { loadFunctionDefinition, evaluate, editMyFunction } from '../api/matefun';
import Icon from './icons/Icon';
import * as icons from '../constants/icons';
import './Actions.scss';

export class Actions extends React.Component {
    constructor() {
        super();
        this.state = {
            evaluationResult: '',
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
        const { openSaveFunction  } = this.state;
        const { canProcess, canSaveFunction, isEditMode, editFuncName } = this.props;
        return( 
            <div className="Actions">
                <div className="action-buttons">
                    { !isEditMode &&    
                        <Button className="mf-button-primary ml-1" 
                            data-tip="Limpiar"
                            data-for='actions'
                            onClick={this.clean}>
                            <Icon icon={icons.CLEAN}/>
                        </Button> 
                    }
                    { isEditMode && 
                        <Button className="mf-button-primary ml-1" 
                            data-tip="Cancelar"
                            data-for='actions'
                            onClick={this.props.cancelEdit}>
                            <Icon icon={icons.CANCEL}/>
                        </Button> 
                    }
                    { !isEditMode && 
                        <Button className="mf-button-primary ml-1" 
                            data-tip="Guardar"
                            data-for='actions'
                            disabled={!canSaveFunction} 
                            onClick={() => this.setState({openSaveFunction: true})}>
                            <Icon icon={icons.SAVE}/>
                        </Button>
                    }
                    { isEditMode &&    
                        <Button className="mf-button-primary ml-1" 
                            disabled={!canSaveFunction} 
                            data-tip="Guardar"
                            data-for='actions'
                            onClick={() => this.props.editMyFunction(editFuncName)}>
                            <Icon icon={icons.SAVE_ALT}/>
                        </Button>
                    }
                    { isEditMode && 
                        <Button className="mf-button-primary ml-1" 
                            disabled={!canSaveFunction} 
                            data-tip="Guardar como ..."
                            data-for='actions'
                            onClick={() => this.setState({openSaveFunction: true})}>
                            <Icon icon={icons.SAVE}/>
                        </Button> 
                    }
                    <Button className="mf-button-primary ml-1" 
                        data-tip="Probar"
                        data-for='actions'
                        disabled={!canProcess} 
                        onClick={this.evaluate}>
                        <Icon icon={icons.PLAY}/>
                    </Button>
                    <ReactTooltip
                        key={`action-${isEditMode ? 'edit-mode' : 'normal'}`}
                        id='actions' 
                        effect='solid'
                        place='top'
                        delayShow={500}
                    />    
                </div>
                { openSaveFunction &&
                    <CreateFunction show={true} onHide={() => this.setState({openSaveFunction: false})}/>
                }
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
    loadFunctionDefinition, evaluate, clean, editMyFunction, cancelEdit
}

export default connect(mapStateToProps, mapDispatchFunction)(Actions);