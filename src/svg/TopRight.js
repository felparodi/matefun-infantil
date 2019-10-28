import React from 'react';

export default class TopRight extends React.Component {

    render() {
        return (
            <svg viewBox="0 0 40 40" width={this.props.size} height={this.props.size} xmlns="http://www.w3.org/2000/svg">
                <g>
                    <title>TopRight</title>
                    <path d="M 10 0 L 10 25 C 10 30 15 30 15 30 L 40 30 L 40 10 L 35 10 C 35 10 30 10 30 5 L 30 0 z"/>
                </g>
            </svg>
        )
    }

}