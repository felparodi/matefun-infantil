import React from 'react';
import { connect } from 'react-redux';
import { joinInput, joinOutput, isEqualJoin } from '../../api/board';
import Base from './function-parts/Base';
import InputRight from './function-parts/InputRight';
import InputLeft from './function-parts/InputLeft';
import InputTop from './function-parts/InputTop';
import Output from './function-parts/Output';
import { DIRECTION } from '../../constants/constants';
import FuncDescriptor from './function-parts/FunctionDescriptor';
import Icon from '../../components/Icon';
import * as icon from '../../constants/icons';
import { METHOD_FUNCTION } from '../../constants/constants';

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
            <div>
                <svg viewBox="0 0 40 40">
                    <Base/>
                    { leftType && <InputLeft join={isJoinLeft} onClick={() => this.joinInput(DIRECTION.LEFT)} type={leftType}/> }
                    { rightType && <InputRight join={isJoinRigth} onClick={() => this.joinInput(DIRECTION.RIGHT)} type={rightType}/>}
                    { topType && <InputTop join={isJoinTop} onClick={() => this.joinInput(DIRECTION.TOP)} type={topType}/>}
                    <Output join={isJoinBottom} onClick={this.joinOutput} type={bottomType}/>
                    {![METHOD_FUNCTION.ADD,METHOD_FUNCTION.SUB,METHOD_FUNCTION.MUL,METHOD_FUNCTION.DIV,METHOD_FUNCTION.CIRC,
                    METHOD_FUNCTION.COLOR,METHOD_FUNCTION.EQUAL,METHOD_FUNCTION.N_EQUAL,METHOD_FUNCTION.GREAT,METHOD_FUNCTION.E_GREAT,
                    METHOD_FUNCTION.LEST,METHOD_FUNCTION.E_LEST,METHOD_FUNCTION.MOVER,METHOD_FUNCTION.ESCALAR].includes(pipe.name) &&
                        <FuncDescriptor name={pipe.name} icon={pipe.icon}/>
                    }
                    {pipe.name===METHOD_FUNCTION.ADD &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.PLUS} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.SUB &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.MINUS} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.MUL &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.TIMES} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.DIV &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.DIVIDE} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.EQUAL &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.EQUAL} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.N_EQUAL &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.NOT_EQUAL} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.GREAT &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.GREATER} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.E_GREAT &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.GREATER_EQUAL} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.LEST &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.LESS} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.E_LEST &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.LESS_EQUAL} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.CIRC &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.CIRCLE} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.ROTAR &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.ROTATE} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.COLOR &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.PAINT} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.MOVER &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.MOVE} color="white"/>
                        </svg>
                    }
                    {pipe.name===METHOD_FUNCTION.ESCALAR &&
                        <svg viewBox="0 0 12 30">
                            <Icon icon={icon.SCALE} color="white"/>
                        </svg>
                    }
                </svg>
            </div>
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
