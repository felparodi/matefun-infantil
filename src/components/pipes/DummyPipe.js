import React from 'react';
import { DIRECTION } from '../../constants/constants.js'

import Vertical from '../../svg/dummies/vertical.svg';
import Horizontal from '../../svg/dummies/horizontal.svg';
import TopRight from '../../svg/dummies/top-right.svg';
import TopLeft from '../../svg/dummies/top-left.svg';
import BottomLeft from '../../svg/dummies/bottom-left.svg';
import BottomRight from '../../svg/dummies/bottom-right.svg';

export class DummyPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        const allDirection = pipe.getAllDirection();
        if (allDirection.indexOf(DIRECTION.TOP) >= 0) {
            if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                return (<Vertical width={this.props.size} height={this.props.size}></Vertical>)
            } else if(allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                return (<TopRight width={this.props.size} height={this.props.size}></TopRight>)
            } else if(allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                return (<TopLeft width={this.props.size} height={this.props.size}></TopLeft>)
            }
        } else if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
            if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) { 
                return (<Horizontal width={this.props.size} height={this.props.size}></Horizontal>)
            } else if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                return (<BottomLeft width={this.props.size} height={this.props.size}></BottomLeft>)
            }
        } else if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
            if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                return (<BottomRight width={this.props.size} height={this.props.size}></BottomRight>)
            }
        }
        return null;
    }
}

