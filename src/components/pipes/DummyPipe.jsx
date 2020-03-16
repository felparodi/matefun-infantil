import React from 'react';
import { DIRECTION } from '../../constants/constants'
import {typeToClass} from '../../classes/helpers/type';
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
import O from './dummies/O';
import LI from './dummies/LI';
import TI from './dummies/TI';
import RI from './dummies/RI';
import DI from './dummies/DI';

export class DummyPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        if (pipe.dir.top) {
            if (pipe.dir.bottom) {
                if (pipe.dir.right) {
                    if (pipe.dir.left) {
                        return (<Cross className={typeToClass(pipe.dir.top)}></Cross>)
                    } else {
                        return (<UBR className={typeToClass(pipe.dir.top)}/>)
                    }
                } else if (pipe.dir.left) {
                    return (<UBL className={typeToClass(pipe.dir.top)}/>)
                } else {
                    return (<Vertical className={typeToClass(pipe.dir.top)}/>)
                }
            } else if (pipe.dir.right) {
                if (pipe.dir.left) {
                    return (<URL className={typeToClass(pipe.dir.top)}/>)
                } else {
                    return (<TopRight className={typeToClass(pipe.dir.top)}/>)
                }
            } else if(pipe.dir.left) {
                return (<TopLeft className={typeToClass(pipe.dir.top)}/>)
            } else {
                return (<TI className={typeToClass(pipe.dir.top)}/>)
            }
        } else if (pipe.dir.left) {
            if (pipe.dir.right) {
                if (pipe.dir.bottom) {
                    return (<BRL className={typeToClass(pipe.dir.left)}/>)
                } else {
                    return (<Horizontal className={typeToClass(pipe.dir.left)}/>)
                }
            } else if (pipe.dir.bottom) {
                return (<BottomLeft className={typeToClass(pipe.dir.left)}/>)
            } else {
                return <LI className={typeToClass(pipe.dir.left)}/>
            }
        } else if (pipe.dir.bottom) {
            if (pipe.dir.right) {
                return (<BottomRight className={typeToClass(pipe.dir.bottom)}/>)
            } else {
                return (<DI className={typeToClass(pipe.dir.bottom)}/>)
            }
        } else if (pipe.dir.right) {
            return (<RI className={typeToClass(pipe.dir.right)}/>);
        }
        return (<O/>);
    }
}

export default DummyPipe;