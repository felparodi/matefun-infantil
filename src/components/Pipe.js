import React from 'react';
import { DragSource } from 'react-dnd';
import Cross from '../svg/cross.svg';
import TopRight from '../svg/dummies/top-right.svg';
import TopDown from '../svg/dummies/top-down.svg';


class Pipe extends React.Component {

    render() {
        const { type, connectDragSource } = this.props;
        if (type=="cross"){
            return connectDragSource(
                <div>
                    <Cross width={this.props.size} height={this.props.size}></Cross>
                </div>  
            )
        } else if (type=="top-down"){
            return connectDragSource(
                <div>
                    <TopDown width={this.props.size} height={this.props.size}></TopDown>
                </div>
            )
        } else if (type=="top-right"){
            return connectDragSource(
                <div>
                    <TopRight width={this.props.size} height={this.props.size}></TopRight>
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

