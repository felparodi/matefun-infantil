import React from 'react';

export default class Output extends React.Component {

    render() {
        return (
            <g transform="rotate(90 20 20)">
                <path d="M 33 28 L 34 30 L 35 28 L 36 30 L 37 28 L 38 30 L 40 30 L 40 10 L 38 10 L 37 12 L 36 10 L 35 12 L 34 10 L 33 12 Z" className={this.props.className}  />
            </g>
        )
    }
}

