import React from 'react';
import { DropTarget } from "react-dnd";
import Pipe from './pipes/Pipe';
import { CELL_PIPE_SIZE } from '../constants/constants.js'

class Cell extends React.Component {

    render() {
        const { isOver, canDrop, connectDropTarget, content } = this.props;
        return connectDropTarget(
<<<<<<< HEAD
            <td key={[this.props.row, this.props.col]} style={{ border: "1px solid black", width: "80px", height: "80px", backgroundColor: isOver ? "green" : "" }}>
                {content &&
                    <Pipe pipe={content} size={CELL_PIPE_SIZE}></Pipe>
=======
            <td key={[this.props.row, this.props.col]} style={{ border: "1px solid black", width: "40px", height: "40px", backgroundColor: isOver ? "green" : "" }}>
                {droppedItem && droppedItem.type &&
                    <Pipe type={droppedItem.type} size="40px"></Pipe>
>>>>>>> refactor-matirx
                }
            </td>
        )
    }
}

const spec = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        props.onDrop(item.pipe);
    }
};
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop()
    };
}

export default DropTarget("SOURCE", spec, collect)(Cell);
