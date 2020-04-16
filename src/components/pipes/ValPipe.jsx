import React from 'react';
import { connect } from 'react-redux';
import {isDefined} from '../../classes/helpers/type';
import { setPipeValue, joinOutput, isEqualJoin } from '../../api/board';
import './ValPipe.scss';
import { DIRECTION } from '../../constants/constants';
import ValueInfo from './function-parts/ValueInfo';
import Output from './function-parts/Output';
import ValueInput from './function-parts/ValueInput';

export class ValPipe extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false
        }
        this.leaveEditing = this.leaveEditing.bind(this);
        this.joinOutput = this.joinOutput.bind(this);
        this.onClickValue = this.onClickValue.bind(this);
    }

    joinOutput() {
        const {pipe} = this.props;
        if(pipe.pos) {
            this.props.joinOutput({...pipe.pos, dir:DIRECTION.BOTTOM})
        }
    }

    leaveEditing(value) {
        const { pipe } = this.props;
        this.setState({ edit: false });
        this.props.setPipeValue(pipe.pos.x, pipe.pos.y, value);
    }

    onClickValue() {
        const {origin, pipe} = this.props;
        if(origin !== "toolbox" && isDefined(pipe.dir.bottom)) {
            this.setState({edit:true})
        }
    }
    
    render() {
        const { pipe, origin, startJoin } = this.props;
        const {edit} = this.state;
        const isSelectJoin = pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.BOTTOM} , startJoin);
        const type = pipe.dir.bottom
        return (
            <div className="ValPipe">
                <svg viewBox="0 0 40 40">
                    <g>
                        <title>Value Bottom</title>
                        <path d="M 20 0 C 10 0 0 10 0 20 C 0 30 10 20 10 30 L 10 33 L 30 33 L 30 30 C 30 20 40 30 40 20 C 40 0 20 0 20 0 z"/>
                        <Output onClick={this.joinOutput} join={isSelectJoin} type={type}></Output>
                    </g>
                    {   
                        !edit && 
                        <ValueInfo 
                            type={type}
                            onClick={this.onClickValue}
                            text={pipe.valueText}/>
                    }
                </svg>
                { edit && <ValueInput value={pipe.value} onBlur={this.leaveEditing} type={type}/> }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    startJoin: state.matrix.startJoin,
});

const mapDispath = {
    setPipeValue,
    joinOutput
}

export default connect(mapStateToProps, mapDispath)(ValPipe);
