import React from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import DummyPipe from './DummyPipe'
import FuncPipe from './FuncPipe';
import EndPipe from './EndPipe';
import ValPipe from './ValPipe';
import VarPipe from './VarPipe';
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
        const p = (
            <div className={classNames("Pipe", { 
                'error': pipe.errors && pipe.errors.length > 0,
                'warning': pipe.warnings && pipe.warnings.length > 0,
                })}>
                    {SwitchPipe(pipe, this.props)}
            </div>
        );
        return connectDragSource(p);
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
    },
    endDrag(props, monitor, component) {
        const {pipe, onDrop} = props
        if(onDrop) {
            const {pos, origin, dropEffect} = monitor.getDropResult();
            props.onDrop({pos, pipe, origin, dropEffect});
        }
    }
};

export default DragSource("SOURCE", cardSource, collect)(Pipe);

