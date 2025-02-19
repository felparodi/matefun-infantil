import React from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import ReactTooltip from 'react-tooltip';
import i18n from 'i18next';
import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import DummyPipe from './DummyPipe'
import FuncPipe from './FuncPipe';
import EndPipe from './EndPipe';
import ConstPipe from './ConstPipe';
import VarPipe from './VarPipe';
import './Pipe.scss';

function SwitchPipe(pipe, props) {
    switch(pipe.type) {
        case PIPE_TYPES.FUNCTION:
        case PIPE_TYPES.CUSTOM:
        case PIPE_TYPES.CONDITION:
            return <FuncPipe {...(props)} />;
        case PIPE_TYPES.CONST:
            return <ConstPipe {...(props)} />;
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

function isColorPipe(pipe) {
    return (pipe.type === PIPE_TYPES.CONST || pipe.type === PIPE_TYPES.VARIABLE) 
        && pipe.dir.bottom === VALUES_TYPES.COLOR;
}

class Pipe extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drag : false
        }
        this.displayResult= this.displayResult.bind(this);
    }

    displayResult(pipe){
        this.props.displayResult(pipe);
    }

    render() {
        const { pipe, connectDragSource, origin, selected } = this.props;
        const { drag } = this.state;
        const tooltipId = pipe.pos ? `${pipe.pos.x}-${pipe.pos.y}-${pipe.name}-${origin}` : `${pipe.name}-${origin}`;
        const hasErrors = pipe.errors && pipe.errors.length > 0; 
        const hasWarning = pipe.warnings && pipe.warnings.length > 0;
        const p = (
            <div className={classNames("Pipe", { 
                    'error': hasErrors,
                    'warning': hasWarning,
                    'working': pipe.isWorking,
                    'selected': selected
                })}
                data-tip={tooltipId}
                data-for={tooltipId}>
                    {SwitchPipe(pipe, this.props)}
                { (hasErrors || hasWarning) && !drag &&
                    <ReactTooltip
                        id={tooltipId}
                        className='tooltip'
                        multiline={true}
                        effect='solid'
                        place='bottom'
                        delayShow={1000}
                        getContent={() => 
                            <div>
                                {pipe.warnings && pipe.warnings.map((m, index) => <p key={index}>AVISO: {i18n.t(m)}</p>)}
                                {pipe.errors && pipe.errors.map((m, index) => <p key={index}>ERROR: {i18n.t(m)}</p>)}
                            </div> 
                        }
                    />
                }
            </div>
        );

        return selected && isColorPipe(pipe) ? p : connectDragSource(p);
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource()
    };
}

const cardSource = {
    beginDrag(props, monitor, component) {
        component.setState({drag : true })
        return { pipe: props.pipe };
    },
    endDrag(props, monitor, component) {
        component.setState({ drag : false })
        const {pipe, onDrop} = props;
        const dropResult = monitor.getDropResult();
        if(onDrop && dropResult) {
            const {pos, origin, dropEffect} = dropResult;
            props.onDrop({pos, pipe, origin, dropEffect});
        }
    }
};

export default DragSource("SOURCE", cardSource, collect)(Pipe);

