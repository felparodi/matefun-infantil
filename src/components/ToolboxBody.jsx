import React from 'react'
import { DropTarget } from "react-dnd";
import { Button } from 'react-bootstrap';
import Pipe from './pipes/Pipe';

class ToolboxBody extends React.Component {
    constructor(props) {
        super(props);
        this.renderPipeCol = this.renderPipeCol.bind(this);
    }

    renderPipeCol(pipe, index) {
        const {onDrop} = this.props;
        return (
            <Button key={index} className="pipe-button" variant="outline-primary">
                <Pipe onDrop={onDrop} pipe={pipe} origin="toolbox"/>
            </Button>
        );
    }
    render() {
        const { group, connectDropTarget } = this.props;
        return (
            connectDropTarget(
                <div className="toolbox-body">
                    { group.pipes.map(this.renderPipeCol) }
                </div>
            )
        )
    }
}

const spec = {
    drop(props, monitor, component) {
        return { origin: 'toolbox' };
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