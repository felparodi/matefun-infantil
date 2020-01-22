import React from 'react';

import DoorClosed from '../../svg/door-closed.svg';
import DoorOpen from '../../svg/door-open.svg';
import { Form } from 'react-bootstrap';

export class VarPipe extends React.Component {

    constructor() {
        super();
        this.state = {
            isOpen: false,
            editingValue: true,
        }
        this.leaveEditing = this.leaveEditing.bind(this);
    }

    leaveEditing(value) {
        if (value == '') {
            this.setState({ isOpen: false });
        } else {
            this.setState({ editingValue: false });
            this.props.onChangeVarValue(this.props.pipe.getPosX(), this.props.pipe.getPosY(), value)
        }
    }

    setDoorState(isOpen) {
        this.setState({ isOpen: isOpen });
    }

    render() {
        if (this.props.origin=="board") {
            console.log('render VarPipe')
        }
        const { pipe } = this.props;
        if (this.state.isOpen) {
            return (
                <div width={this.props.size} height={this.props.size}>
                    {this.state.editingValue &&
                        <Form.Control onBlur={(e) => this.leaveEditing(e.target.value)} type="email"
                            style={{ position: 'absolute', width: this.props.size, marginTop: '30px' }} />
                    }
                    <svg width={this.props.size} height={this.props.size}>
                        <DoorOpen onClick={() => this.setDoorState(false)} width={this.props.size} height={this.props.size} />
                        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="35" fill='white'
                            onClick={() => { this.setState({ editingValue: true }) }}>
                            {pipe.value}
                        </text>
                    </svg>
                </div>
            )
        } else {
            return (
                <DoorClosed onClick={() => this.setDoorState(true)} width={this.props.size} height={this.props.size} />
            )
        }
    }
}

