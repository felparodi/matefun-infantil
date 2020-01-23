import React from 'react';

export default class InputLeft extends React.Component {

    render() {
        return (
            <svg viewBox="0 0 40 40">
                <path d="M 0 10 L 0 30 L 7 30 L 7 10" style={{ fill: this.props.color }} />
            </svg>
        )
    }
}

