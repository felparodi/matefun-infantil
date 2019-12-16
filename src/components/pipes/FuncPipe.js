import React from 'react';

import T from '../../svg/t-out2.svg';

export class FuncPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        return (
            <T width={this.props.size} height={this.props.size}></T>
        )
    }
}

