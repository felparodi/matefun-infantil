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

function getTypeColor(type) {
    switch (type) {
        case VALUES_TYPES.NUMBER:
            return "green";
        case VALUES_TYPES.FIGURE:
            return "blue";
        case VALUES_TYPES.COLOR:
            return "orange";
        case VALUES_TYPES.VAR:
            return "red";
    }
}

export class FuncPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        var leftType = pipe.getInType(DIRECTION.LEFT);
        var rightType = pipe.getInType(DIRECTION.RIGHT);
        var topType = pipe.getInType(DIRECTION.TOP);
        var bottomType = pipe.getOutType(DIRECTION.BOTTOM);
        return (
            <svg viewBox="0 0 40 40" width={this.props.size} height={this.props.size}>
                <Base pipe={pipe}></Base>
                {leftType &&
                    <InputLeft color={getTypeColor(leftType)}></InputLeft>
                }
                {rightType && 
                    <InputRight color={getTypeColor(rightType)}></InputRight>
                }
                {topType && 
                    <InputTop color={getTypeColor(topType)}></InputTop>
                }
                <Output color={getTypeColor(bottomType)}></Output>
                <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={(this.props.origin == "toolbox") ? "20px" : "50px"} fill='white'>
                    {pipe.getName() == METHOD_FUNCTION.ADD && '+'}
                    {pipe.getName() == METHOD_FUNCTION.SUB && '-'}
                    {pipe.getName() == METHOD_FUNCTION.MUL && 'x'}
                    {pipe.getName() == METHOD_FUNCTION.DIV && '%'}
                </text>
                {pipe.getName() == 'color' &&
                    <Color></Color>
                }
                {pipe.getName() == 'rotar' &&
                    <Rotar></Rotar>
                }
                {pipe.getName() == 'circ' &&
                    <Circ></Circ>
                }
                {pipe.getName() == 'rect' &&
                    <Rect></Rect>
                }
                {pipe.getName() == 'escalar' &&
                    <Escalar></Escalar>
                }
            </svg>
        )
    }
}

