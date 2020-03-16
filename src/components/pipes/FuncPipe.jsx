import React from 'react';
import { connect } from 'react-redux';
import { joinInput, joinOutput, isEqualJoin } from '../../api/board';
import Base from './function-parts/Base';
import InputRight from './function-parts/InputRight';
import InputLeft from './function-parts/InputLeft';
import InputTop from './function-parts/InputTop';
import Output from './function-parts/Output';
import { DIRECTION } from '../../constants/constants';
import Icons from './function-parts/Icons';

export class FuncPipe extends React.Component {
    constructor(props) {
        super(props);
        this.joinInput = this.joinInput.bind(this);
        this.joinOutput = this.joinOutput.bind(this);
    }

    joinInput(dir) {
        const {pipe} = this.props;
        if(pipe.pos) {
            this.props.joinInput({...pipe.pos, dir})
        }
    }

    joinOutput() {
        const {pipe} = this.props;
        if(pipe.pos) {
            this.props.joinOutput({...pipe.pos, dir:DIRECTION.BOTTOM})
        }
    }

    render() {
        const { pipe, startJoin, endJoin } = this.props;
        const leftType = pipe.dir.left;
        const rightType = pipe.dir.right;
        const topType = pipe.dir.top;
        const bottomType = pipe.dir.bottom;
        const isJoinLeft =  pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.LEFT} , endJoin);
        const isJoinTop =  pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.TOP} , endJoin);
        const isJoinRigth =  pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.RIGHT} , endJoin);
        const isJoinBottom =  pipe.pos && isEqualJoin({...pipe.pos, dir:DIRECTION.BOTTOM} , startJoin);
        return (
            <svg viewBox="0 0 40 40">
                <Base/>
                { leftType && <InputLeft join={isJoinLeft} onClick={() => this.joinInput(DIRECTION.LEFT)} type={leftType}/> }
                { rightType && <InputRight join={isJoinRigth} onClick={() => this.joinInput(DIRECTION.RIGHT)} type={rightType}/>}
                { topType && <InputTop join={isJoinTop} onClick={() => this.joinInput(DIRECTION.TOP)} type={topType}/>}
                <Output join={isJoinBottom} onClick={this.joinOutput} type={bottomType}/>
                <Icons name={pipe.name}/>
            </svg>
        )
    }
}

const mapStateToProps = state => ({
    startJoin: state.matrix.startJoin,
    endJoin: state.matrix.endJoin,
});;
const mapDispatchToProps = {
    joinInput,
    joinOutput
}

export default connect(mapStateToProps, mapDispatchToProps)(FuncPipe);
