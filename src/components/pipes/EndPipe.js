import React from 'react';

import EndTop from '../../svg/end-top.svg';

export class EndPipe extends React.Component {

    render() {
        //console.log('render EndPipe')
        const { pipe } = this.props;
        return (
            <svg width={this.props.size} height={this.props.size}>
                <EndTop width={this.props.size} height={this.props.size}></EndTop>
                {pipe.value != null &&
                    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="35" fill='white'>
                        {pipe.value}
                    </text>
                }
            </svg>
        )
    }
}

