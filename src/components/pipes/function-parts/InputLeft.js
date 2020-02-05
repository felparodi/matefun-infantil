import React from 'react';

export default class InputLeft extends React.Component {

    render() {
        return (
            <path d="M 0 10 L 0 30 L 7 30 L 7 10" style={{ fill: this.props.color }} />
        )
    }
}

