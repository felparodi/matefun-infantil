import React from 'react';
import { DragSource } from 'react-dnd';
import { PIPE_TYPES, DIRECTION } from '../../constants/constants.js'
import { DummyPipe } from './DummyPipe.js'
import { FuncPipe } from './FuncPipe.js'
import { EndPipe } from './EndPipe.js'
import { ValPipe } from './ValPipe.js'
import { VarPipe } from './VarPipe.js';
import './Pipe.scss';

function SwitchPipe(pipe, props) {
    if (pipe.getType() == PIPE_TYPES.FUNCTION) {
        return <FuncPipe {...(props)} />
    } else if (pipe.getType() == PIPE_TYPES.VALUE) {
        return <ValPipe {...(props)} />
    } else if (pipe.getType() == PIPE_TYPES.END) {
        return <EndPipe {...(props)} />
    } else if (pipe.getType() == PIPE_TYPES.DUMMY) {
        return <DummyPipe {...(props)} />
    } else if (pipe.getType() == PIPE_TYPES.VARIABLE) {
        return <VarPipe {...(props)} />
    }
    return null;
}

class Pipe extends React.Component {

    constructor(props) {
        super();
    }

    render() {

        const { pipe, connectDragSource, origin } = this.props;
        const p = (<div className="Pipe">{SwitchPipe(pipe, this.props)}</div>);
        if (origin == "toolbox") {
            return connectDragSource(p);
        } else if (origin == "board") {
            return p;
        }
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

