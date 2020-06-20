import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import PipeButton from './PipeButton'
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
                    { pipes.map((pipe, index) => 
                        <React.Fragment key={`${index}-custom`} >
                            <PipeButton
                                pipe={pipe} 
                                onDrop={onDrop}
                                data-tip={`${index}-custom`}
                                data-for={`${index}-custom`}/>
                            <ReactTooltip
                                key={`${index}-custom}`} 
                                id={`${index}-custom`} 
                                effect='solid'
                                place='right'
                                className='pipe-button-tooltip'
                                delayShow={500}
                                getContent={() =><p>{pipe.name}</p>}
                                />
                        </React.Fragment>
                    ) 
                    }
                </div>
            </div>
        )

    }
}

const mapStateToProps = state => ({
    myFunctions: state.environment.myFunctions
});

export default connect(mapStateToProps)(ToolboxCustom);