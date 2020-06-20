import React from 'react'
import { DropTarget } from "react-dnd";
import ToolboxCustom from './ToolboxCustom';
import ReactTooltip from 'react-tooltip';
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
                            <div className="standard">
                                <div className="container">
                                { group.pipes.map((pipe, index) =>
                                    <React.Fragment  key={`${index}-${group.value}`} >
                                        <PipeButton
                                            pipe={pipe} onDrop={onDrop}
                                            data-tip={`${index}-${group.value}`}
                                            data-for={`${index}-${group.value}`}/> 
                                        { pipe.tooltip && 
                                            <ReactTooltip
                                                id={`${index}-${group.value}`} 
                                                effect='solid'
                                                place='right'
                                                className='pipe-button-tooltip'
                                                delayShow={500}
                                                getContent={() =><p>{pipe.tooltip}</p>}
                                            />
                                        }
                                    </React.Fragment>
                                )
                                }      
                                </div>
                            </div>
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