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
        if (pipe.dir.top) {
            if (pipe.dir.bottom) {
                if (pipe.dir.right) {
                    if (pipe.dir.left) {
                        return (<Cross className={pipe.dir.top}></Cross>)
                    } else {
                        return (<UBR className={pipe.dir.top}/>)
                    }
                } else if (pipe.dir.left) {
                    return (<UBL className={pipe.dir.top}/>)
                } else {
                    return (<Vertical className={pipe.dir.top}/>)
                }
            } else if (pipe.dir.right) {
                if (pipe.dir.left) {
                    return (<URL className={pipe.dir.top}/>)
                } else {
                    return (<TopRight className={pipe.dir.top}/>)
                }
            } else if(pipe.dir.left) {
                return (<TopLeft className={pipe.dir.top}/>)
            }
        } else if (pipe.dir.left) {
            if (pipe.dir.right) {
                if (pipe.dir.bottom) {
                    return (<BRL className={pipe.dir.left}/>)
                } else {
                    return (<Horizontal className={pipe.dir.left}/>)
                }
            } else if (pipe.dir.bottom) {
                return (<BottomLeft className={pipe.dir.bottom}/>)
            }
        } else if (pipe.dir.bottom) {
            if (pipe.dir.right) {
                return (<BottomRight className={pipe.dir.bottom}/>)
            }
        }
        return null;
    }
}

export default DummyPipe;