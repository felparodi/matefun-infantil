import React from 'react';
import {connect} from 'react-redux';
import { addPipe, editCustomFunction } from '../../api/board';
import { Button } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import {PIPE_TYPES} from '../../constants/constants';
import toolboxGroups, {COMPLEX} from '../../constants/toolbox';
import ToolboxBody from './ToolboxBody';
import Icon from '../icons/Icon';
import Trash from './Trash';

import './Toolbox.scss';

function toolboxPipeSnapshot(toolboxPipe, maxComplex=COMPLEX) {
    return toolboxPipe
        .filter(({complex}) => complex <= maxComplex)
        .map(group => ({
            ...group,
            pipes: group.pipes
                .filter(({complex}) => complex <= maxComplex)
                .map(({pipe, tooltip}) => pipe ? { ...(pipe.snapshot()), tooltip} : null)
        })
    );
}

const ToolboxHeader = ({pipeToolsGroup, select, onClick}) => (
    <div className="toolbox-header">
        { 
            pipeToolsGroup.map((toolbar, index) => (
                    <Button key={index}
                        className={classNames("button-group", {'selected': select === toolbar.value })}
                        onClick={() => onClick(toolbar.value)}
                        data-tip={toolbar.label}
                        data-for='button-toolbar'>
                        {toolbar.icon ?
                            <Icon icon={toolbar.icon} size='30px'/>
                            : <span>{toolbar.label}</span>
                        }
                    </Button>
            )) 
        }
        <ReactTooltip
            id='button-toolbar'
            effect='solid'
            place='right'
            className='pipe-button-tooltip'
            delayShow={500}/>
    </div>
)

export class Toolbox extends React.Component {
    constructor(props) {
        super(props)
        this.onDrop = this.onDrop.bind(this);
        this.state = {
            select: toolboxGroups[0].value,
            pipeToolsGroup:  toolboxPipeSnapshot(toolboxGroups),
            deletePipe: null,
        }
    }

    componentDidMount() {
        const {complex} = this.props;
        this.setState({   pipeToolsGroup: toolboxPipeSnapshot(toolboxGroups, complex) });
    }

    onDrop(drop) {
        const {origin, pos, pipe} = drop;
        if(origin === 'trash' && pipe.type === PIPE_TYPES.CUSTOM) {
            this.setState({ deletePipe: pipe });
        } else if(origin === 'edit') {
            this.props.editCustomFunction(pipe);
        } else if(origin === 'board') {
            this.props.addPipe(pos, pipe);
        }
    }

    componentDidUpdate(prevProp) {
        if(prevProp.complex != this.props.complex) {
            this.setState({ pipeToolsGroup: toolboxPipeSnapshot(toolboxGroups, this.props.complex) });
        }
    }

    render() {
        const {select, pipeToolsGroup, deletePipe} = this.state;
        return (
            <div className="Toolbox">
                <div className="tabs">
                    <ToolboxHeader 
                        pipeToolsGroup={pipeToolsGroup}
                        select={select}
                        onClick={(value)=> this.setState({select: value})}/>
                    <ToolboxBody
                        onDrop={this.onDrop}
                        group={pipeToolsGroup.find((toolbar) => toolbar.value === select)}/>
                </div>
                <Trash deletePipe={deletePipe}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    complex: state.config.complex
});

const mapDispatchToProps = {
    addPipe,
    editCustomFunction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);