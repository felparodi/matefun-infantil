import React from 'react';
import { DropTarget } from "react-dnd";
import Pipe from './pipes/Pipe';
import { CELL_SIZE } from '../constants/constants.js'

class Cell extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        console.log('render Cell')
        //console.log(this.props)
        const { isOver, canDrop, connectDropTarget, content } = this.props;

        return connectDropTarget(
            content == null ?
            <div key={[this.props.row, this.props.col]} style={{ border: "1px solid lightgray", width: `${CELL_SIZE}rem`, height: `${CELL_SIZE}rem`, backgroundColor: isOver ? "green" : "" }} />
            :
            <div key={[this.props.row, this.props.col]} style={{ border: "1px solid lightgray", width: `${CELL_SIZE}rem`, height: `${CELL_SIZE}rem`, backgroundColor: isOver ? "green" : "" }}>
                <Pipe pipe={content} size={`${CELL_SIZE}rem`} onChangeVarValue={this.props.onChangeVarValue} origin="board"></Pipe>
            </div>
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
