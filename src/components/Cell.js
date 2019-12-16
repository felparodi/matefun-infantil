import React from 'react';
import { DropTarget } from "react-dnd";
import Pipe from './pipes/Pipe';
import { CELL_SIZE } from '../constants/constants.js'

class Cell extends React.Component {

    render() {
        const { isOver, canDrop, connectDropTarget, content } = this.props;
        return connectDropTarget(
            <td key={[this.props.row, this.props.col]} width={CELL_SIZE} height={CELL_SIZE} style={{ border: "1px solid black", backgroundColor: isOver ? "green" : "" }}>
                {content &&
                    <Pipe pipe={content} size={CELL_SIZE}></Pipe>
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
