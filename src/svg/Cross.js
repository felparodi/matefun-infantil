import React from 'react';
import { DragSource } from 'react-dnd';

class Cross extends React.Component {

    render() {
        const { name, connectDragSource } = this.props;
        return connectDragSource(
            <div>
                <svg viewBox="0 0 40 40" width={this.props.size} height={this.props.size} xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <title>Cross</title>
                        <path d="M 10 0 L 10 5 L 5 10 L 0 10 L 0 30 L 5 30 L 10 35 L 10 40 L 30 40 L 30 35 L 35 30 L 40 30 L 40 10 L 35 10 L 30 5 L 30 0 Z" />
                    </g>
                </svg>
            </div>
        )
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource()
    };
}

const cardSource = {
    beginDrag(props, monitor, component) {
        const item = { id: "cross" };
        return item;
    }
};

export default DragSource("SOURCE", cardSource, collect)(Cross);

