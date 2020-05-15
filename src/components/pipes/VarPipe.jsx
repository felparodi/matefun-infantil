import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { typeToClass, isDefined } from '../../classes/helpers/type';
import { setPipeValue, joinOutput, isEqualJoin } from '../../api/board';
import Output from './function-parts/Output';
import ValueInfo from './function-parts/ValueInfo';
import ValueInput, {hasInputValue} from './function-parts/ValueInput';
import { DIRECTION, VALUES_TYPES } from '../../constants/constants';

import './ValuePipe.scss';

function defaultValueType(type) {
    switch(type) {
        case VALUES_TYPES.NUMBER:
            return 0;
        case VALUES_TYPES.POINT:
            return {x:0, y:0}
        case VALUES_TYPES.COLOR:
            return { color:'Negro' }
        default:
            return null;
    }
}


const JoinOutput = (props) => (
    <g className={props.className}>
        <path d="M 10 30 L 10 34 L 30 34 L 30 30 Z"/>
        <path className="border" d="M 10 30 L 10 34 L 15 34 L 15 30 Z"/>
        <path className="border" d="M 25 30 L 25 34 L 30 34 L 30 30 Z"/>
    </g>
);

const DoorsOpen = ({onClick}) => (
    <g>
        <path onClick={onClick} d="M 5 5 L 0 10 L 0 35 L 5 30 Z" style={{'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth': 0.3 }}/>
        <path class="pipe-base" d="M 5 5 L 5 30 L 35 30 L 35 5 Z" style={{'stroke': 'black', 'strokeWidth': 0.3 }}/>
        <path onClick={onClick} d="M 35 5 L 40 10 L 40 35 L 35 30 Z" style={{ 'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth' :0.3 }}/>
    </g>
)

export const DoorOpen = (props) => { 
    const { pipe, onClickDoor, onClickValue, onDoubleClickValue, onClickOutput, startJoin } = props;
    const isSelectJoin = pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.BOTTOM} , startJoin)
    const type = pipe.dir.bottom;
    return (
        <svg viewBox="0 0 40 40">
            <JoinOutput className={classNames(typeToClass(type), {'join':isSelectJoin})}/>
            <DoorsOpen onClick={onClickDoor}/>
            <ValueInfo onClick={onClickValue} onDoubleClick={onDoubleClickValue} text={pipe.valueText} type={type}/>
            <Output onClick={onClickOutput} join={isSelectJoin} type={type}></Output>
        </svg>
    );
}

const DoorsClosed = ({onClick}) => (
    <g  onClick={onClick} >
        <path id="p1" d="M 5 5 L 5 30 L 35 30 L 35 5 Z" style={
            {'fill': 'saddlebrown', 'stroke': 'black', 'strokeWidth': 0.3}}/>      
        <line x1="20" y1="5" x2="20" y2="30" style={{'stroke':'black', 'strokeWidth':0.3}}/>
        <circle cx="18.6" cy="17" r="0.5" stroke="black" fill="red" strokeWidth="1"/>
        <circle cx="21.4" cy="17" r="0.5" stroke="black" fill="red" strokeWidth="1"/>
    </g>
)


export const DoorClosed = (props) => { 
    const { pipe, onClickDoor, onClickOutput, startJoin } = props;
    const isSelectJoin = pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.BOTTOM} , startJoin)
    return (
        <svg viewBox="0 0 40 40">
            <JoinOutput className={classNames(typeToClass(pipe.dir.bottom), {'join':isSelectJoin})}/>
            <DoorsClosed onClick={onClickDoor}/>
            <Output onClick={onClickOutput} join={isSelectJoin} type={pipe.dir.bottom}></Output>
        </svg>
    );
}

export class VarPipe extends React.Component {

    constructor() {
        super();
        this.state = {
            editingValue: false,
            editModal: false,
        }
        this.leaveEditing = this.leaveEditing.bind(this);
        this.setDoorState = this.setDoorState.bind(this);
        this.setEditingValue = this.setEditingValue.bind(this);
        this.joinOutput = this.joinOutput.bind(this);
        this.openDoor = this.openDoor.bind(this);
        this.handlerDoubleClickValue = this.handlerDoubleClickValue.bind(this);
        this.handlerHideModal = this.handlerHideModal.bind(this);
    }

    openDoor() {
        const { pipe, active } = this.props;
        const type = pipe.dir.bottom;
        if(active && hasInputValue(type)) {
            this.setDoorState(true)
        }
    }

    joinOutput() {
        const {pipe} = this.props;
        if(pipe.pos) {
            this.props.joinOutput({...pipe.pos, dir:DIRECTION.BOTTOM})
        }
    }

    leaveEditing(value) {
        const { pipe } = this.props;
        this.setState({ editingValue: false });
        this.props.setPipeValue(pipe.pos.x, pipe.pos.y, value);
    }

    setDoorState(isOpen) {
        const { pipe } = this.props;
        this.setState({ isOpen: isOpen, editingValue: isOpen });
        if(!isOpen) {
            this.props.setPipeValue(pipe.pos.x, pipe.pos.y, null);
        } else {
            this.props.setPipeValue(pipe.pos.x, pipe.pos.y, defaultValueType(pipe.dir.bottom));
        }
    }

    setEditingValue(value) {
        this.setState({ editingValue: value });
    }

    handlerDoubleClickValue() {
        const {active, pipe} = this.props;
        if(active && isDefined(pipe.dir.bottom)) {
            this.setState({ editModal:true })
        }
    }

    handlerHideModal(value) {
        this.setState({ editModal: false });
        if(value !== undefined) {
            const { pipe } = this.props;
            this.props.setPipeValue(pipe.pos.x, pipe.pos.y, value);
        }
    }


    render() {
        const { isOpen, editingValue, editModal } = this.state;
        const { pipe, startJoin } = this.props;
        if (pipe.value || isOpen) {
            return (
                <div className="VarPipe">
                    { editingValue && <ValueInput value={pipe.value} type={pipe.dir.bottom} onBlur={this.leaveEditing}/> }
                    <DoorOpen pipe={pipe}
                        startJoin={startJoin}
                        onClickOutput={this.joinOutput}
                        onClickValue={() => this.setEditingValue(true)} 
                        onDoubleClickValue={this.handlerDoubleClickValue}
                        onClickDoor={() => this.setDoorState(false)}/>
                </div>
            )
        }
        return (<DoorClosed startJoin={startJoin} onClickOutput={this.joinOutput} pipe={pipe} onClickDoor={this.openDoor} />);
    }
}

const mapStateToProps = (state) => ({
    startJoin: state.matrix.startJoin,
});

const mapDispath = {
    setPipeValue,
    joinOutput
}

export default connect(mapStateToProps, mapDispath)(VarPipe);
