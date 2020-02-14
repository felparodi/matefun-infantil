import React from 'react';

import EndTop from '../../svg/end-top.svg';

export class EndPipe extends React.Component {

    render() {
        //console.log('render EndPipe')
        const { pipe } = this.props;
        return (
            <svg viewBox="0 0 40 40">
                <g transform="rotate(-180 20 20)">
                    <path d="M 20 0 L 0 20 L 10 30 L 10 40 L 30 40 L 30 30 L 40 20 z"/>
                </g>
                {pipe.value != null &&
                    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="35" fill='white'>
                        {pipe.value}
                    </text>
                }
            </svg>
        )
    }
}

