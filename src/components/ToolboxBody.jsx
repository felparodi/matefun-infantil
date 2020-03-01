import React from 'react'
import { DropTarget } from "react-dnd";
import { Button } from 'react-bootstrap';
import Pipe from './pipes/Pipe';

const renderPipeCol = (pipe, index) => (
    <Button key={index} className="pipe-button" variant="outline-primary">
        <Pipe pipe={pipe} origin="toolbox"/>
    </Button>
)

class ToolboxBody extends React.Component {
    render() {
        const { group, connectDropTarget } = this.props;
        return (
            connectDropTarget(
                <div className="toolbox-body">
                    { group.pipes.map(renderPipeCol) }
                </div>
            )
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

export default DropTarget("SOURCE", spec, collect)(ToolboxBody)