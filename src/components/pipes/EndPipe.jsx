import React from 'react';
import { connect } from 'react-redux';
import { joinInput } from '../../api/board';
import { DisplayResult } from '../modal/DisplayResult';
import InputTop from './function-parts/InputTop';
import { VALUES_TYPES, DIRECTION } from '../../constants/constants';
import Image from '../../icons/imagen.svg';

const OutPutValue = (props) => {
    const {valueMateFun, valueText, dir} = props.pipe;
    debugger;
    return (
        <React.Fragment>
            {
            valueText &&  
                <text x="50%" y="50%"
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="35"
                fill='white'>
                {valueText}
            </text>
            }
            {
                valueMateFun && dir.top === VALUES_TYPES.FIGURE &&
                <Image/>
            }
        </React.Fragment>
    );
}

export class EndPipe extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showResult: false
        }
        this.handlerHiddenResult = this.handlerHiddenResult.bind(this);
        this.openDisplayResult = this.openDisplayResult.bind(this);
        this.joinInput = this.joinInput.bind(this);
    }

    openDisplayResult() {
        const { origin, pipe } = this.props;
        if (origin === 'board') {
            if(pipe.valueMateFun) {
                this.setState({showResult : true})
            }
        }
    }

    handlerHiddenResult() {
        this.setState({showResult : false})
    }

    joinInput() {
        const {pipe} = this.props;
        if(pipe.pos) {
            this.props.joinInput({...pipe.pos, dir:DIRECTION.TOP})
        }
    }

    render() {
        const { pipe, origin } = this.props;
        const { showResult } = this.state;
        return (
            <React.Fragment>
                <DisplayResult 
                    show={showResult}
                    value={pipe.valueMateFun}
                    type={pipe.dir.top}
                    valuetext={pipe.valueText}
                    onHide={this.handlerHiddenResult} />
                <svg onDoubleClick={this.openDisplayResult} viewBox="0 0 40 40">
                    <g transform="rotate(-180 20 20)">
                        <path d="M 20 0 L 0 20 L 10 30 L 10 40 L 30 40 L 30 30 L 40 20 z"/>
                    </g>
                    <InputTop onClick={this.joinInput} type={pipe.dir.top}/>
                    <OutPutValue pipe={pipe}/>
                </svg>
            </React.Fragment>
        )
    }
}

const mapStateToProps = null;
const mapDispatchToProps = {
    joinInput
}

export default connect(mapStateToProps, mapDispatchToProps)(EndPipe);
