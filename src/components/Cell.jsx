import React from 'react';
import classNames from 'classnames';
import { DropTarget } from "react-dnd";
import Pipe from './pipes/Pipe';
import './Cell.scss';

class Cell extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        const { isOver, connectDropTarget, content, onChangeVarValue } = this.props;
        return connectDropTarget(
            <div className={classNames('Cell', { 'over': isOver })}>
                { content &&  <Pipe pipe={content} onChangeVarValue={onChangeVarValue} origin="board"></Pipe>}
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
