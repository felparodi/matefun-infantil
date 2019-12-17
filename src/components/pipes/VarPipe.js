import React from 'react';

import DoorClosed from '../../svg/door-closed.svg';
import DoorOpen from '../../svg/door-open.svg';

export class VarPipe extends React.Component {

    constructor(){
        super();
        this.state= {
            isOpen: false
        }
    }

    setDoorState(isOpen){
        this.setState({isOpen: isOpen});
    }

    render() {
        const { pipe } = this.props;
        if (this.state.isOpen){
            return (
                <DoorOpen onClick={()=>this.setDoorState(false)} width={this.props.size} height={this.props.size}/>
            )
        } else {
            return (
                <DoorClosed onClick={()=>this.setDoorState(true)} width={this.props.size} height={this.props.size}/>
            )
        }
    }
}

