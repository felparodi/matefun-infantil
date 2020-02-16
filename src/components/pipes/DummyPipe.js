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
        const allDirection = pipe.allDirections;
        if (allDirection.indexOf(DIRECTION.TOP) >= 0) {
            if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                    if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                        return (<Cross className={pipe.valueType}></Cross>)
                    } else {
                        return (<UBR className={pipe.valueType}/>)
                    }
                } else if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                    return (<UBL className={pipe.valueType}/>)
                } else {
                    return (<Vertical className={pipe.valueType}/>)
                }
            } else if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                    return (<URL className={pipe.valueType}/>)
                } else {
                    return (<TopRight className={pipe.valueType}/>)
                }
            } else if(allDirection.indexOf(DIRECTION.LEFT) >= 0) {
                return (<TopLeft className={pipe.valueType}/>)
            }
        } else if (allDirection.indexOf(DIRECTION.LEFT) >= 0) {
            if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                    return (<BRL className={pipe.valueType}/>)
                } else {
                    return (<Horizontal className={pipe.valueType}/>)
                }
            } else if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
                return (<BottomLeft className={pipe.valueType}/>)
            }
        } else if (allDirection.indexOf(DIRECTION.BOTTOM) >= 0) {
            if (allDirection.indexOf(DIRECTION.RIGHT) >= 0) {
                return (<BottomRight className={pipe.valueType}/>)
            }
        }
        return null;
    }
}

