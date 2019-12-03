import React from 'react';
import { DIRECTION } from '../constants/constants.js'

import T from '../svg/t.svg';

export class ValPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        return (
            <T width={this.props.size} height={this.props.size}></T>
        )
    }
}

