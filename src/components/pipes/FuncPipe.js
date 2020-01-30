import React from 'react';

import Base from './function-parts/Base';
import InputRight from './function-parts/InputRight';
import InputLeft from './function-parts/InputLeft';
import InputTop from './function-parts/InputTop';
import Output from './function-parts/Output';
import { METHOD_FUNCTION } from '../../constants/constants'
import PaintBucket from '../../icons/paint-bucket.svg'


export class FuncPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        return (
            <svg width={this.props.size} height={this.props.size}>
                <Base pipe={pipe}></Base>
                <InputRight color="orange"></InputRight>
                <InputLeft color="blue"></InputLeft>
                <InputTop color="green"></InputTop>
                <Output color="red"></Output>
                <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={(this.props.origin == "toolbox") ? "20px" : "50px"} fill='white'>
                    {pipe.getName() == METHOD_FUNCTION.ADD && '+'}
                    {pipe.getName() == METHOD_FUNCTION.SUB && '-'}
                    {pipe.getName() == METHOD_FUNCTION.MUL && 'x'}
                    {pipe.getName() == METHOD_FUNCTION.DIV && '%'}
                </text>
                {pipe.getName()=='color' && 
                    <PaintBucket></PaintBucket>
                }
            </svg>
        )
    }
}

