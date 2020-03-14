import React from 'react';
import { connect } from 'react-redux';
import {removePipe} from '../api/board';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import toolboxGroups from '../constants/toolbox';
import ToolboxBody from './ToolboxBody';
import './Toolbox.scss';

function toolboxPipeSnapshot(toolboxPipe) {
    return toolboxPipe.map(group => ({
            value: group.value,
            label: group.label,
            pipes: group.pipes.map((pipe) => pipe ? pipe.snapshot() : null)
        })
    );
}

export class Toolbox extends React.Component {
    constructor(props) {
        super(props)
        this.onDrop = this.onDrop.bind(this)
        this.state = {
            select: toolboxGroups[1].value,
            pipeToolsGroup: toolboxPipeSnapshot(toolboxGroups)
        }
    }

    onDrop(pipe) {
        this.props.removePipe(pipe);
    }

    render() {
        const {select, pipeToolsGroup} = this.state;
        return (
            <div className="Toolbox">
                <div className="toolbox-header">
                { 
                    pipeToolsGroup.map((toolbar, index) => (
                        <Button key={index}
                            className={classNames("button-group", {'selected': select === toolbar.value })}
                            onClick={()=> this.setState({select: toolbar.value})}>
                            <span>{toolbar.label}</span>
                        </Button>
                    )) 
                }
                </div>
                <ToolboxBody
                    onDrop={this.onDrop}
                    group={pipeToolsGroup.find((toolbar) => toolbar.value === select)}/>
            </div>
        )
    }
}

const mapDispatchToProps = {
    removePipe
}

export default connect(null, mapDispatchToProps)(Toolbox);