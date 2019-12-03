import React from 'react';
import { DragSource } from 'react-dnd';
import Cross from '../svg/cross.svg';
import T from '../svg/t.svg';
import { PIPE_TYPES, DIRECTION } from '../constants/constants.js'
import DummyPipe from './DummyPipe.js'

class Pipe extends React.Component {

    render() {
        const { type, connectDragSource } = this.props;
        if (type==PIPE_TYPES.FUNCTION){
            return connectDragSource(
                <div>
                    <Cross width={this.props.size} height={this.props.size}></Cross>
                </div>
            )
        } else if (type=="t"){
            return connectDragSource(
                <div>
                    <T width={this.props.size} height={this.props.size}></T>
                </div>
            )
        } else if (type==PIPE_TYPES.DUMMY){
            return connectDragSource(
                <div>
                    <DummyPipe></DummyPipe>
                </div>
            )
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource()
    };
}

const cardSource = {
    beginDrag(props, monitor, component) {
        const item = { type: props.type };
        return item;
    }
};

export default DragSource("SOURCE", cardSource, collect)(Pipe);

