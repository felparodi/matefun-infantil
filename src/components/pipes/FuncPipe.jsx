import React from 'react';
import { connect } from 'react-redux';
import { joinInput, joinOutput } from '../../api/board';
import Base from './function-parts/Base';
import InputRight from './function-parts/InputRight';
import InputLeft from './function-parts/InputLeft';
import InputTop from './function-parts/InputTop';
import Output from './function-parts/Output';
import { METHOD_FUNCTION, VALUES_TYPES, DIRECTION } from '../../constants/constants'
import Color from '../../icons/color.svg'
import Rotar from '../../icons/rotar.svg'
import Circ from '../../icons/circ.svg'
import Escalar from '../../icons/escalar.svg'
import Rect from '../../icons/rect.svg'
import Linea from '../../icons/linea.svg'
import Poli from '../../icons/poli.svg'
import Mover from '../../icons/mover.svg'


function getTypeColor(type) {
    switch (type) {
        case VALUES_TYPES.NUMBER:
            return "green";
        case VALUES_TYPES.FIGURE:
            return "blue";
        case VALUES_TYPES.COLOR:
            return "orange";
        case VALUES_TYPES.POINT:
            return "red";
    }
}

const TextIcon = (props) => (
    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="20px" fill='white'>
        { props.text }
    </text>
);

const FunctionIcon = (props) => {
    switch(props.name) {
        case METHOD_FUNCTION.COLOR:
            return <Color/>;
        case METHOD_FUNCTION.ROTAR:
            return <Rotar/>;
        case METHOD_FUNCTION.RECT:
            return <Rect/>;
        case METHOD_FUNCTION.LINEA:
            return <Linea/>
        case METHOD_FUNCTION.POLI:
            return <Poli/>;
        case METHOD_FUNCTION.ESCALAR:
            return <Escalar/>;
        case METHOD_FUNCTION.MOVER: 
            return <Mover/>;
        case METHOD_FUNCTION.CIRC:
            return <Circ/>
        case METHOD_FUNCTION.ADD:
            return <TextIcon text="+"/>;
        case METHOD_FUNCTION.SUB:
            return <TextIcon text="-"/>;
        case METHOD_FUNCTION.MUL:
            return <TextIcon text="x"/>;
        case METHOD_FUNCTION.DIV:
            return <TextIcon text="%"/>;
        case METHOD_FUNCTION.EQUAL:
            return <TextIcon text="=="/>;
        case METHOD_FUNCTION.N_EQUAL:
            return <TextIcon text="/="/>;
        case METHOD_FUNCTION.GREAT:
            return <TextIcon text=">"/>;
        case METHOD_FUNCTION.E_GREAT:
            return <TextIcon text=">="/>;
        case METHOD_FUNCTION.LEST:
            return <TextIcon text="<"/>;
        case METHOD_FUNCTION.E_LEST:
            return <TextIcon text="<="/>;
        case METHOD_FUNCTION.NOT:
            return <TextIcon text="!"/>;
        default:
            return <TextIcon text={props.name}/>;
    }
}

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
        const { pipe } = this.props;
        const leftType = pipe.dir.left;
        const rightType = pipe.dir.right;
        const topType = pipe.dir.top;
        const bottomType = pipe.dir.bottom;
        return (
            <svg viewBox="0 0 40 40">
                <Base pipe={pipe}></Base>
                { leftType && <InputLeft onClick={() => this.joinInput(DIRECTION.LEFT)} className={leftType}></InputLeft> }
                { rightType && <InputRight onClick={() => this.joinInput(DIRECTION.RIGHT)} className={rightType}></InputRight> }
                { topType && <InputTop onClick={() => this.joinInput(DIRECTION.TOP)} className={topType}></InputTop> }
                <Output onClick={this.joinOutput} className={bottomType}></Output>
                <FunctionIcon name={pipe.name}/>
            </svg>
        )
    }
}

const mapStateToProps = null;
const mapDispatchToProps = {
    joinInput,
    joinOutput
}

export default connect(mapStateToProps, mapDispatchToProps)(FuncPipe);
