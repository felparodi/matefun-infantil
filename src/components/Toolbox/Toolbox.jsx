import React from 'react';
import {connect} from 'react-redux';
import { dropPipe, editCustomFunction } from '../../api/board';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import toolboxGroups, {COMPLEX} from '../../constants/toolbox';
import ToolboxBody from './ToolboxBody';
import Icon from '../Icon';
import DeleteModal from '../modal/DeleteFunction';
import Trash from './Trash';

import './Toolbox.scss';

function toolboxPipeSnapshot(toolboxPipe, maxComplex=COMPLEX) {
    return toolboxPipe
        .filter(({complex}) => complex <= maxComplex)
        .map(group => ({
            ...group,
            pipes: group.pipes
                .filter(({complex}) => complex <= maxComplex)
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
            pipeToolsGroup:  toolboxPipeSnapshot(toolboxGroups),
            deletePipe: null,
        }
    }

    componentDidMount() {
        const {complex} = this.props;
        this.setState({   pipeToolsGroup: toolboxPipeSnapshot(toolboxGroups, complex) });
    }

    onDrop(drop) {
        if(drop.origin === 'trash') {
            this.setState({ deletePipe:drop.pipe });
        } else if(drop.origin === 'edit') {
            this.props.editCustomFunction(drop.pipe);
        } else if(drop.origin === 'board') {
            this.props.dropPipe(drop);
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
                    <div className="toolbox-header">
                    { 
                        pipeToolsGroup.map((toolbar, index) => (
                            <Button key={index}
                                className={classNames("button-group", {'selected': select === toolbar.value })}
                                onClick={()=> this.setState({select: toolbar.value})}>
                                {toolbar.icon ?
                                    <Icon icon={toolbar.icon} size='30px'/>
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
                <Trash/>
                { deletePipe && 
                    <DeleteModal pipe={deletePipe} show={!!deletePipe}
                        onHide={() => this.setState({deletePipe: null})}/> 
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    complex: state.config.complex
});

const mapDispatchToProps = {
    dropPipe,
    editCustomFunction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);