import React from 'react';
import { DIRECTION } from '../../constants/constants'

import Vertical from './dummies/Vertical';
import Horizontal from './dummies/Horizontal';
import TopRight from './dummies/TopRight';
import TopLeft from  './dummies/TopLeft';
import BottomLeft from './dummies/BottomLeft';
import BottomRight from './dummies/BottomRight';
import Cross from './dummies/Cross';
import UBR from './dummies/UBR';
import UBL from './dummies/UBL';
import URL from './dummies/URL';
import BRL from './dummies/BRL';

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

