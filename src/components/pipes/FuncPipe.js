import React from 'react';

import T from '../../svg/t-out2.svg';

export class FuncPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        return (
            <svg width={this.props.size} height={this.props.size}>
                <T width={this.props.size} height={this.props.size}></T>
                <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" font-size="35" fill='white'>
                    {pipe.getName() == 'add' && '+'}
                    {pipe.getName() == 'sub' && '-'}
                    {pipe.getName() == 'mul' && 'x'}
                    {pipe.getName() == 'div' && '%'}
                </text>
            </svg>
        )
    }
}

