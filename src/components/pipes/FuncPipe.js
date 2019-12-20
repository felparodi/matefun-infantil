import React from 'react';

import T from '../../svg/t-out2.svg';
import { METHOD_FUNCTION } from '../../constants/constants'
export class FuncPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        return (
            <svg width={this.props.size} height={this.props.size}>
                <T width={this.props.size} height={this.props.size}></T>
                <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="35" fill='white'>
                    {pipe.getName() == METHOD_FUNCTION.ADD && '+'}
                    {pipe.getName() ==  METHOD_FUNCTION.SUB && '-'}
                    {pipe.getName() ==  METHOD_FUNCTION.MUL && 'x'}
                    {pipe.getName() ==  METHOD_FUNCTION.DIV && '%'}
                </text>
            </svg>
        )
    }
}

