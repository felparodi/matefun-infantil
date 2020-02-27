import React from 'react';
import { Form } from 'react-bootstrap';
import Output from './function-parts/Output';
import { InputType, castValue } from './ValPipe'
import './ValPipe.scss';

const JoinOutput = (props) => (
    <g className={props.className}>
        <path d="M 10 30 L 10 34 L 30 34 L 30 30 Z"/>
        <path className="border" d="M 10 30 L 10 34 L 15 34 L 15 30 Z"/>
        <path className="border" d="M 25 30 L 25 34 L 30 34 L 30 30 Z"/>
    </g>
);

export const DoorOpen = (props) => { 
    const { pipe, onClickDoor, onClickValue } = props;
    return (
        <svg viewBox="0 0 40 40">
            <JoinOutput className={pipe.dir.bottom}/>
            <g onClick={onClickDoor}>
                <path d="M 5 5 L 0 10 L 0 35 L 5 30 Z" style={{'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth': 0.3 }}/>
                <path d="M 5 5 L 5 30 L 35 30 L 35 5 Z" style={{'fill': '#000000d6', 'stroke': 'black', 'strokeWidth': 0.3 }}/>
                <path d="M 35 5 L 40 10 L 40 35 L 35 30 Z" style={{ 'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth' :0.3 }}/>
            </g>
            <text x="50%" y="50%" 
                dominantBaseline="central" 
                textAnchor="middle" 
                fontSize="20" 
                onClick={onClickValue}
                fill='white'>
                {pipe.valueText}
            </text>
            <Output className={pipe.dir.bottom}></Output>
        </svg>
    );
}

export const DoorClosed = (props) => { 
    const { pipe, onClickDoor } = props;
    return (
        <svg viewBox="0 0 40 40">
            <JoinOutput className={pipe.dir.bottom}/>
            <g  onClick={onClickDoor} >
                <path id="p1" d="M 5 5 L 5 30 L 35 30 L 35 5 Z" style={
                    {'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth': 0.3}}/>      
                <line x1="20" y1="5" x2="20" y2="30" style={{'stroke':'black', 'strokeWidth':0.3}}/>
                <circle cx="18.6" cy="17" r="0.5" stroke="black" fill="red" strokeWidth="1"/>
                <circle cx="21.4" cy="17" r="0.5" stroke="black" fill="red" strokeWidth="1"/>
            </g>
            <Output className={pipe.dir.bottom}></Output>
        </svg>
    );
}

export class VarPipe extends React.Component {

    constructor() {
        super();
        this.state = {
            editingValue: true,
        }
        this.leaveEditing = this.leaveEditing.bind(this);
        this.setDoorState = this.setDoorState.bind(this);
        this.setEditingValue = this.setEditingValue.bind(this);
    }

    leaveEditing(value) {
        const { pipe, onChangeVarValue } = this.props;
        value = castValue(value, pipe.outType);
        this.setState({ editingValue: false });
        onChangeVarValue(pipe.posX, pipe.posY, value);
    }

    setDoorState(isOpen) {
        const { pipe, onChangeVarValue } = this.props;
        this.setState({ isOpen: isOpen, editingValue: isOpen });
        if(!isOpen) {
            onChangeVarValue(pipe.posX, pipe.posY, null);
        }
    }

    setEditingValue(value) {
        this.setState({ editingValue: value });
    }

    render() {
        const { isOpen, editingValue } = this.state;
        const { pipe, origin } = this.props;
        if (pipe.value || isOpen) {
            return (
                <div className="VarPipe">
                    { editingValue && <InputType value={pipe.value} type={pipe.outType} onBlur={this.leaveEditing}/> }
                    <DoorOpen pipe={pipe}
                        onClickValue={() => this.setEditingValue(true)} 
                        onClickDoor={() => this.setDoorState(false)}/>
                </div>
            )
        }
        return (<DoorClosed pipe={pipe} onClickDoor={() => origin !== 'toolbox' && this.setDoorState(true)} />);
    }
}

