import React from 'react'
import { DropTarget } from "react-dnd";
import ToolboxCustom from './ToolboxCustom';
import PipeButton from './PipeButton';


class ToolboxBody extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { group, connectDropTarget, onDrop} = this.props;
      
        return (
            connectDropTarget(
                <div className="toolbox-body">
                    {   
                        group.value !== 'custom' ? 
                        group.pipes.map((pipe, index) => <PipeButton key={`${index}-${group.value}`} pipe={pipe} onDrop={onDrop}/>) : 
                        <ToolboxCustom onDrop={onDrop}/>
                    }
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