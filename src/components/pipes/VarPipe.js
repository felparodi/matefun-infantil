import React from 'react';
import DoorClosed from '../../svg/door-closed.svg';
import { Form } from 'react-bootstrap';
import './VarPipe.scss';

export const DoorOpen = (props) => { 
    const { value, onClickDoor, onClickValue } = props;
    return (
        <svg viewBox="0 0 40 40">
            <g onClick={onClickDoor}>
                <path id="p1" d="M 10 30 L 10 40 L 30 40 L 30 30 Z" style={{'fill': 'black'}}/>
                <path id="p1" d="M 5 5 L 0 10 L 0 35 L 5 30 Z" style={{'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth': 0.3 }}/>
                <path id="p1" d="M 5 5 L 5 30 L 35 30 L 35 5 Z" style={{'fill': '#000000d6', 'stroke': 'black', 'strokeWidth': 0.3 }}/>
                <path id="p1" d="M 35 5 L 40 10 L 40 35 L 35 30 Z" style={{ 'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth' :0.3 }}/>
            </g>
            <text x="50%" y="50%" 
                dominantBaseline="central" 
                textAnchor="middle" 
                fontSize="20" 
                onClick={onClickValue}
                fill='white'>
                {value}
            </text>
        </svg>
    );
}

export class VarPipe extends React.Component {

    constructor() {
        super();
        this.state = {
            isOpen: false,
            editingValue: true,
        }
        this.leaveEditing = this.leaveEditing.bind(this);
        this.setDoorState = this.setDoorState.bind(this);
        this.setEditingValue = this.setEditingValue.bind(this);
    }

    leaveEditing(e) {
        const { value } = e.target;
        const { pipe, onChangeVarValue } = this.props;
        this.setState({ isOpen: value !== '', editingValue: false });
        this.props.onChangeVarValue(this.props.pipe.getPosX(), this.props.pipe.getPosY(), value)
    }

    setDoorState(isOpen) {
        this.setState({ isOpen: isOpen });
    }

    setEditingValue(value) {
        this.setState({ editingValue: value });
    }

    render() {
        const { isOpen, editingValue } = this.state;
        const { pipe } = this.props;
        if (isOpen) {
            return (
                <div className="VarPipe">
                    { editingValue && <input className="form-control" onBlur={this.leaveEditing} type="text"/> }
                    <DoorOpen value={pipe.value} 
                        onClickValue={() => this.setEditingValue(true)} 
                        onClickDoor={() => this.setDoorState(false)}/>
                </div>
            )
        }
        return (<DoorClosed onClick={() => this.setDoorState(true)} />);
    }
}

