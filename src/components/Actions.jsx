import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Consola from './Console';
import { clean } from '../api/board';
import CreateFunction from './modal/CreateFunction';
import { loadFunctionDefinition, evaluate } from '../api/matefun';
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
        const { canProcess, canSaveFunction } = this.props;
        return( 
            <div>
                <div className="action-buttons">
                    <Button className="mf-button-primary" onClick={this.clean}>
                        <Icon icon={icon.CLEAN}/> Limpiar
                    </Button>
                    { debugMode && 
                        <Button className="mf-button-primary ml-1" onClick={() => this.setState({openConsole:!openConsole})}>
                            <Icon icon={icon.CONSOLE}/> Consola
                        </Button> 
                    }
                    <Button className="mf-button-primary ml-1" disabled={!canSaveFunction} onClick={() => this.setState({openSaveFunction: true})}>
                        <Icon icon={icon.SAVE}/> Guardar
                    </Button>
                    <Button className="mf-button-primary ml-1" disabled={!canProcess} onClick={this.evaluate}>
                        <Icon icon={icon.PLAY}/> Probar
                    </Button>
                </div>
                <CreateFunction show={openSaveFunction} onHide={() => this.setState({openSaveFunction: false})}/>
                
                {/*{ debugMode && <Consola openConsole={openConsole}/> }*/}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    canProcess: state.matrix.canProcess,
    canSaveFunction: state.matrix.canSaveFunction,
    userData: state.user.userData
});

const mapDispatchFunction = {
    loadFunctionDefinition, evaluate, clean
}

export default connect(mapStateToProps, mapDispatchFunction)(Actions);