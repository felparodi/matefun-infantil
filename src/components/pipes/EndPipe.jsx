import React from 'react';
import { connect } from 'react-redux';
import { joinInput, isEqualJoin } from '../../api/board';
import InputTop from './function-parts/InputTop';
import { VALUES_TYPES, DIRECTION } from '../../constants/constants';
import TextIcon from '../icons/TextIcon';
import Image from '../../icons/imagen.svg';
import Error from '../../icons/error.svg';
import Lupa from '../../icons/lupa.svg';

const TEXT_LENGTH = 10

const OutPutValue = ({pipe}) => {
    const {value, valueText, dir, hasValueError} = pipe;
    const type = dir.top;
    if(hasValueError) {
        return <Error/>;
    } else if(value && (type === VALUES_TYPES.FIGURE || type === VALUES_TYPES.list(VALUES_TYPES.FIGURE)) ) {
        return <Image/>;
    } else if(valueText) {
         if(valueText.length <= TEXT_LENGTH) {
            return <TextIcon text={valueText}/>;
         } else {
            return <Lupa/>;
         }
    }
    return null;
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
            if(pipe.value) {
                this.props.displayResult(pipe);
                //this.setState({showResult : true})
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
        const { pipe, origin, endJoin } = this.props;
        const { showResult } = this.state;
        const isSelectJoin = pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.TOP} , endJoin)
        return (
            <React.Fragment>
                <svg onDoubleClick={this.openDisplayResult} viewBox="0 0 40 40">
                    <g transform="rotate(-180 20 20)">
                        <path className="pipe-base" d="M 20 0 L 0 20 L 10 30 L 10 40 L 30 40 L 30 30 L 40 20 z"/>
                    </g>
                    <InputTop onClick={this.joinInput} join={isSelectJoin} type={pipe.dir.top}/>
                    <OutPutValue pipe={pipe}/>
                </svg>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    endJoin: state.matrix.endJoin,
});

const mapDispatchToProps = {
    joinInput
}

export default connect(mapStateToProps, mapDispatchToProps)(EndPipe);
