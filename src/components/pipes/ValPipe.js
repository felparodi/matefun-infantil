import React from 'react';
import './ValPipe.scss';
import {  VALUES_TYPES } from '../../constants/constants'

export const InputType = (props) => {
    switch(props.type) {
        case VALUES_TYPES.NUMBER:
            return <input className="form-control" onBlur={props.onBlur} type="number"/> 
        default:
            return <input className="form-control" onBlur={props.onBlur} type="text"/> 
    }
}

export const castValue = (value, type) => {
    switch(type) {
        case VALUES_TYPES.NUMBER:
            return Number(value);
        default:
            return value;
    }
}

export class ValPipe extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false
        }
        this.leaveEditing = this.leaveEditing.bind(this);
    }

    leaveEditing(e) {
        const { pipe, onChangeVarValue } = this.props;
        const value = castValue(e.target.value, pipe.outType);
        this.setState({ edit: false });
        onChangeVarValue(pipe.posX, pipe.posY, value);
    }
    
    render() {
        const { pipe } = this.props;
        const {edit} = this.state;
        return (
            <div className="ValPipe">
                <svg viewBox="0 0 40 40">
                    <g>
                        <title>Value Bottom</title>
                        <path d="M 20 0 C 10 0 0 10 0 20 C 0 30 10 20 10 30 L 10 40 L 30 40 L 30 30 C 30 20 40 30 40 20 C 40 0 20 0 20 0 z"/>
                    </g>
                    {!edit &&
                        <text x="50%" y="50%" 
                            dominantBaseline="central" 
                            textAnchor="middle" 
                            fontSize="15" 
                            onClick={() => this.setState({edit:true})}
                            fill='white'>
                            {pipe.valueText}
                        </text>
                    }
                </svg>
                { edit && <InputType onBlur={this.leaveEditing} type={pipe.outType}/> }
            </div>
        )
    }
}

