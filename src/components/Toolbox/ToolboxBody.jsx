import React from 'react'
import { DropTarget } from "react-dnd";
import ToolboxCustom from './ToolboxCustom';
import ReactTooltip from 'react-tooltip';
import PipeButton from './PipeButton';


const ToolboxStandard = ({group, onDrop}) => (
    <div className="standard">
        <div className="container">
        { group.pipes.map((pipe, index) =>
                <PipeButton
                    key={`${index}-${group.value}`} 
                    pipe={pipe}
                    onDrop={onDrop}
                    data-tip={`${pipe.tooltip}`}
                    data-for={ pipe.tooltip ? `pipe-button-tool-item-${group.value}` : 'no-tooltip'}/> 
            )
        }  
        <ReactTooltip
                key={`pipe-button-tool-item-${group.value}`}
                id={`pipe-button-tool-item-${group.value}`} 
                effect='solid'
                place='right'
                className='pipe-button-tooltip'
                delayShow={500}
            />    
        </div>
    </div>
)

class ToolboxBody extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { group, connectDropTarget, onDrop} = this.props;
      
        return (
            connectDropTarget(
                <div className="toolbox-body">
                    {  group.value !== 'custom' ? 
                        <ToolboxStandard group={group} onDrop={onDrop}/>
                        : 
                        <ToolboxCustom onDrop={onDrop}/>
                    }
                 
                </div>
            )
        )
    }
}

const spec = {
    drop(props, monitor, component) {
        const dropResult = monitor.getDropResult()
        return { origin: dropResult ? dropResult.origin : 'toolbox' };
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