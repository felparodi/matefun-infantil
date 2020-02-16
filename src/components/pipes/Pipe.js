import React from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import { PIPE_TYPES, DIRECTION } from '../../constants/constants.js'
import { DummyPipe } from './DummyPipe.js'
import { FuncPipe } from './FuncPipe.js'
import { EndPipe } from './EndPipe.js'
import { ValPipe } from './ValPipe.js'
import { VarPipe } from './VarPipe.js';
import './Pipe.scss';

function SwitchPipe(pipe, props) {
    switch(pipe.type) {
        case PIPE_TYPES.FUNCTION:
        case PIPE_TYPES.CONDITION:
            return <FuncPipe {...(props)} />;
        case PIPE_TYPES.VALUE:
            return <ValPipe {...(props)} />;
        case PIPE_TYPES.END:
            return <EndPipe {...(props)} />;
        case PIPE_TYPES.DUMMY:
            return <DummyPipe {...(props)} />;
        case PIPE_TYPES.VARIABLE:
            return <VarPipe {...(props)} />;
        default:
            return null;   
    }
}

class Pipe extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        const { pipe, connectDragSource, origin } = this.props;
 
        const p = pipe ? (
            <div className={classNames("Pipe", { 
                'error':pipe.errors && pipe.errors.length > 0,
                'warning': pipe.warnings && pipe.warnings.length > 0
                })}>
                    {SwitchPipe(pipe, this.props)}
            </div>) :
            <div className="Pipe"/>
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

