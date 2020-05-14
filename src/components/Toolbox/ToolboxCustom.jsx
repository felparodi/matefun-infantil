import React from 'react';
import { connect } from 'react-redux';
import PipeButton from './PipeButton'
import Trash from './Trash';
import Edit from './Edit';

import './ToolboxCustom.scss';

export class ToolboxCustom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipes: []
        };
    }

    componentDidMount() {
        const pipes = this.props.myFunctions.map(pipe => pipe.snapshot());
        this.setState({ pipes:pipes });
    }

    componentDidUpdate(prevProp) {
        if(prevProp.myFunctions != this.props.myFunctions) {
            const pipes = this.props.myFunctions.map(pipe => pipe.snapshot());
            this.setState({ pipes:pipes });
        }
    }

    render() {
        const {onDrop} = this.props;
        const { pipes } = this.state;
        return (
            <div className="ToolboxCustom">
                <Edit/>
                <div className="pipes">
                    { pipes.map((pipe, index) => <PipeButton key={`${index}-custom`} pipe={pipe} onDrop={onDrop}/>) }
                </div>
            </div>
        )

    }
}

const mapStateToProps = state => ({
    myFunctions: state.environment.myFunctions
});

export default connect(mapStateToProps)(ToolboxCustom);