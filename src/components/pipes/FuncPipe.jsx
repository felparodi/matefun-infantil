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
                    METHOD_FUNCTION.LEST,METHOD_FUNCTION.E_LEST,METHOD_FUNCTION.MOVER,METHOD_FUNCTION.ESCALAR,METHOD_FUNCTION.JUNTAR]
                    .includes(pipe.name) ? 
                        <FuncDescriptor name={pipe.name} icon={pipe.icon}/>
                        :
                        <svg viewBox="0 0 12 30">
                            <Icon icon={getIconForMethod(pipe.name)} color="white"/>
                        </svg>
                    }
                </svg>
            </div>
        )
    }
}

function getIconForMethod(name) {

    switch(name){
        case METHOD_FUNCTION.ADD:
            return icon.PLUS
        case METHOD_FUNCTION.SUB:
            return icon.MINUS
        case METHOD_FUNCTION.MUL:
            return icon.TIMES
        case METHOD_FUNCTION.DIV:
            return icon.DIVIDE
        case METHOD_FUNCTION.EQUAL:
            return icon.EQUAL
        case METHOD_FUNCTION.N_EQUAL:
            return icon.NOT_EQUAL
        case METHOD_FUNCTION.GREAT:
            return icon.GREATER
        case METHOD_FUNCTION.E_GREAT:
            return icon.GREATER_EQUAL
        case METHOD_FUNCTION.LEST:
            return icon.LESS
        case METHOD_FUNCTION.E_LEST:
            return icon.LESS_EQUAL
        case METHOD_FUNCTION.CIRC:
            return icon.CIRCLE
        case METHOD_FUNCTION.ROTAR:
            return icon.ROTATE
        case METHOD_FUNCTION.COLOR:
            return icon.PAINT
        case METHOD_FUNCTION.MOVER:
            return icon.MOVE
        case METHOD_FUNCTION.ESCALAR:
            return icon.SCALE
        case METHOD_FUNCTION.JUNTAR:
            return icon.GROUP
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
