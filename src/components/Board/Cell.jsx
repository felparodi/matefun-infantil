import React from 'react';
import classNames from 'classnames';
import { DropTarget } from "react-dnd";
import Pipe from '../pipes/Pipe';
import './Cell.scss';

class Cell extends React.Component {

    constructor(props) {
        super();
        this.displayResult= this.displayResult.bind(this);
    }

    displayResult(pipe){
        this.props.displayResult(pipe);
    }

    render() {
        const { isOver, connectDropTarget, content, onDrop, onDoubleClick } = this.props;
        return connectDropTarget(
            <div className={classNames('Cell', { 'over': isOver })} 
                onDoubleClick={onDoubleClick}>
                { content &&  <Pipe onDrop={onDrop} pipe={content} origin="board" displayResult={this.displayResult}/>}
            </div>
        )
    }
}

const spec = {
    drop(props, monitor, component) {
        return { 
            pos: {x: props.posX, y: props.posY}, 
            origin: 'board'
        };
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
