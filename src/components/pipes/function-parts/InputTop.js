import React from 'react';

export default class InputTop extends React.Component {

    render() {
        return (
            <svg viewBox="0 0 40 40">
                <path d="M 10 0 L 10 7 L 30 7 L 30 0" style={{ fill: this.props.color }} />
            </svg>
        )
    }
}

