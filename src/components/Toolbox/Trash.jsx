import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as fas from '@fortawesome/free-solid-svg-icons';
import { DropTarget } from "react-dnd";

export class Trash extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        const { isOver, connectDropTarget } = this.props;
        return connectDropTarget(
            <div className={classNames('Trash drop-zone', { 'over': isOver })}>
                <FontAwesomeIcon icon={fas.faTrash}/>
            </div>
        )
    }
}

const spec = {
    drop(props, monitor, component) {
        return { 
            origin: 'trash',
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

export default DropTarget("SOURCE", spec, collect)(Trash);
