import React from 'react';
import { DIRECTION } from '../../constants/constants.js'

import Vertical from '../../svg/dummies/vertical.svg';
import Horizontal from '../../svg/dummies/horizontal.svg';
import TopRight from '../../svg/dummies/top-right.svg';
import TopLeft from '../../svg/dummies/top-left.svg';
import BottomLeft from '../../svg/dummies/bottom-left.svg';
import BottomRight from '../../svg/dummies/bottom-right.svg';
import Cross from '../../svg/dummies/cross.svg';
import UBR from '../../svg/dummies/ubr.svg';
import UBL from '../../svg/dummies/ubl.svg';
import URL from '../../svg/dummies/url.svg';
import BRL from '../../svg/dummies/brl.svg';

export class DummyPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        const allDirection = pipe.getAllDirection();
        if (allDirection.indexOf(DIRECTION.TOP) >= 0) {
            if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                    if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                        return (<Cross width={this.props.size} height={this.props.size}></Cross>)
                    } else {
                        return (<UBR width={this.props.size} height={this.props.size}/>)
                    }
                } else if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                    return (<UBL width={this.props.size} height={this.props.size}/>)
                } else {
                    return (<Vertical width={this.props.size} height={this.props.size}/>)
                }
            } else if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                    return (<URL width={this.props.size} height={this.props.size}/>)
                } else {
                    return (<TopRight width={this.props.size} height={this.props.size}/>)
                }
            } else if(allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                return (<TopLeft width={this.props.size} height={this.props.size}/>)
            }
        } else if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
            if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                    return (<BRL width={this.props.size} height={this.props.size}/>)
                } else {
                    return (<Horizontal width={this.props.size} height={this.props.size}/>)
                }
            } else if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                return (<BottomLeft width={this.props.size} height={this.props.size}/>)
            }
        } else if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
            if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                return (<BottomRight width={this.props.size} height={this.props.size}/>)
            }
        }
        return null;
    }
}

