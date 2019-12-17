import React from 'react';
import { DragSource } from 'react-dnd';
import { PIPE_TYPES, DIRECTION } from '../../constants/constants.js'
import { DummyPipe } from './DummyPipe.js'
import { FuncPipe } from './FuncPipe.js'
import { EndPipe } from './EndPipe.js'
import { ValPipe } from './ValPipe.js'
import { VarPipe } from './VarPipe.js';

class Pipe extends React.Component {

    render() {
        const { pipe, connectDragSource } = this.props;
        if (pipe.getType()==PIPE_TYPES.FUNCTION){
            return connectDragSource(
                <div>
                    <FuncPipe {...(this.props)}/>
                </div>
            )
        } else if (pipe.getType()==PIPE_TYPES.VALUE){
            return connectDragSource(
                <div>
                    <ValPipe {...(this.props)}/>
                </div>
            )
        } else if (pipe.getType()==PIPE_TYPES.END){
            return connectDragSource(
                <div>
                    <EndPipe {...(this.props)}/>
                </div>
            )
        } else if (pipe.getType()==PIPE_TYPES.DUMMY){
            return connectDragSource(
                <div>
                    <DummyPipe {...(this.props)}/>
                </div>
            )
        } else if (pipe.getType()==PIPE_TYPES.VARIABLE){
            return connectDragSource(
                <div>
                    <VarPipe {...(this.props)}/>
                </div>
            )
        }
        return null;
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource()
    };
}

const cardSource = {
    beginDrag(props, monitor, component) {
        const item = { pipe: props.pipe };
        return item;
    }
};

export default DragSource("SOURCE", cardSource, collect)(Pipe);

