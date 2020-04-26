import React from 'react';
import { connect } from 'react-redux';
import {dropPipe} from '../../api/board';
import { deleteMyFunctions } from '../../api/matefun';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import toolboxGroups, {COMPLEX} from '../../constants/toolbox';
import ToolboxBody from './ToolboxBody';
import Icon from '../Icon';

import './Toolbox.scss';

function toolboxPipeSnapshot(toolboxPipe, maxComplex=COMPLEX) {
    return toolboxPipe
        .filter(({complex}) => complex <= maxComplex)
        .map(group => ({
            ...group,
            pipes: group.pipes
                .filter(({complex}) => complex <= COMPLEX)
                .map(({pipe}) => pipe ? pipe.snapshot() : null)
        })
    );
}

export class Toolbox extends React.Component {
    constructor(props) {
        super(props)
        this.onDrop = this.onDrop.bind(this);
        this.state = {
            select: toolboxGroups[0].value,
            pipeToolsGroup:  toolboxPipeSnapshot(toolboxGroups)
        }
    }

    componentDidMount() {
        const {complex} = this.props;
        this.setState({   pipeToolsGroup: toolboxPipeSnapshot(toolboxGroups, complex) });
    }

    onDrop(drop) {
        if(drop.origin !== 'trash') {
            this.props.dropPipe(drop);
        } else {
            this.props.deleteMyFunctions(drop.pipe.name);
        }
    }

    componentDidUpdate(prevProp) {
        if(prevProp.complex != this.props.complex) {
            this.setState({ pipeToolsGroup: toolboxPipeSnapshot(toolboxGroups, this.props.complex) });
        }
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
                            {toolbar.icon ?
                                <Icon icon={toolbar.icon}/>
                                : <span>{toolbar.label}</span>
                            }
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

const mapStateToProps = state => ({
    complex: state.config.complex
});

const mapDispatchToProps = {
    dropPipe,
    deleteMyFunctions
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);