import React from 'react';

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
        case METHOD_FUNCTION.ADD:
            return <TextIcon text="+"/>;
        case METHOD_FUNCTION.SUB:
            return <TextIcon text="-"/>;
        case METHOD_FUNCTION.MUL:
            return <TextIcon text="x"/>;
        case METHOD_FUNCTION.DIV:
            return <TextIcon text="%"/>;
        default:
            return <TextIcon text={props.name}/>;
    }
}

export class FuncPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        var leftType = pipe.getInType(DIRECTION.LEFT);
        var rightType = pipe.getInType(DIRECTION.RIGHT);
        var topType = pipe.getInType(DIRECTION.TOP);
        var bottomType = pipe.getOutType();
        return (
            <svg viewBox="0 0 40 40">
                <Base pipe={pipe}></Base>
                { leftType && <InputLeft color={getTypeColor(leftType)}></InputLeft> }
                { rightType && <InputRight color={getTypeColor(rightType)}></InputRight> }
                { topType && <InputTop color={getTypeColor(topType)}></InputTop> }
                <Output color={getTypeColor(bottomType)}></Output>
                <FunctionIcon name={pipe.getName()}/>
            </svg>
        )
    }
}

