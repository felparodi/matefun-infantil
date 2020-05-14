import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { VALUES_TYPES } from '../constants/constants';
import Icon from './Icon';
import * as icons from '../constants/icons';
import MateFun2D from './graph/MateFun2D';
import './DisplayResult.scss';

export class DisplayResult extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { lastEvalValue } = this.props;
        const { hasError, value, text, type } = lastEvalValue;

        if(!type) return <div className="DisplayResult"/>;

        const graph = type  === VALUES_TYPES.FIGURE  || type === VALUES_TYPES.list(VALUES_TYPES.FIGURE);

        return (
            <div className={classNames("DisplayResult", { 'graph' : graph })}>
                <div className="title">
                    <p>({hasError ? 'Error' : type})</p>
                    { graph && <button><Icon icon={icons.EXPAND_WINDOWS}/></button> }
                </div>
                { 
                    !hasError && graph ? 
                    <MateFun2D value={value} type={type}/> :
                    <textarea className="info result" readOnly value={text}/>
                }
            </div>
        )
      
    }
}

const mapStateToProps = state => {
    return {
        lastEvalValue: state.matrix.lastEvalValue,
    }
}

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(DisplayResult);