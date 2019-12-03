import React from 'react';
import { DIRECTION } from '../constants/constants.js'

import EndTop from '../svg/end-top.svg';

export class EndPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        return (
            <EndTop width={this.props.size} height={this.props.size}></EndTop>
        )
    }
}

