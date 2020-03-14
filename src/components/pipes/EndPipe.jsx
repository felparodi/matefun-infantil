import React from 'react';
import { DisplayResult } from '../modal/DisplayResult';
import InputTop from './function-parts/InputTop';
import { VALUES_TYPES } from '../../constants/constants';
import Image from '../../icons/imagen.svg'

const OutPutValue = (props) => {
    const {valueMateFun, valueText} = props.pipe;
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
                valueMateFun && !valueText &&
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


    render() {
        const { pipe, origin } = this.props;
        const { showResult } = this.state;
        return (
            <React.Fragment>
                <DisplayResult 
                    show={showResult}
                    value={pipe.valueMateFun}
                    valuetext={pipe.valueText}
                    onHide={this.handlerHiddenResult} />
                <svg onDoubleClick={this.openDisplayResult} viewBox="0 0 40 40">
                    <g transform="rotate(-180 20 20)">
                        <path d="M 20 0 L 0 20 L 10 30 L 10 40 L 30 40 L 30 30 L 40 20 z"/>
                    </g>
                    <InputTop className={pipe.dir.top}/>
                    <OutPutValue pipe={pipe}/>
                </svg>
            </React.Fragment>
        )
    }
}

export default EndPipe;
