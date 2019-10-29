import React from 'react';
import { DropTarget } from "react-dnd";
import Cross from '../svg/Cross'

class Cell extends React.Component {

    render() {
        const { isOver, canDrop, connectDropTarget, droppedItem } = this.props;
        return connectDropTarget(
            <td key={[this.props.row, this.props.col]} style={{ border: "1px solid black", width: "80px", height: "80px", backgroundColor: isOver ? "green" : "" }}>
                {droppedItem && droppedItem.id &&
                    <Cross size="30px"></Cross>
                }
            </td>
        )
    }
}

const spec = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        props.onDrop(item);
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
