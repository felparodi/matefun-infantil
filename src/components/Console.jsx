import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

export class Console extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            evalInstruction, workspaceFunction, resultEval, openConsole
        } = this.props;
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
} 

const mapStateToProps = state => ({
    evalInstruction: state.matrix.evalInstruction,
    workspaceFunction: state.matrix.workspaceFunction,
    resultEval: state.matrix.resultEval
});

export default connect(mapStateToProps)(Console);