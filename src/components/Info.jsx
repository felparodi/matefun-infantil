import React from 'react';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import DisplayResult from './DisplayResult';
import Icon from './Icon';
import * as icon from '../constants/icons';
import SelectPipeInfo from './SelectPipeInfo';

import './Info.scss';

export class Info extends React.Component {

    render() {
        const { closeOpenPanel, collapsed } = this.props;
        return (
            <div className={classNames("Info", { 'collapsed': collapsed })}>
                <div className="buttons">
                    <div onClick={closeOpenPanel} style={{cursor: 'pointer'}}> 
                        <Icon size="30px" icon={!collapsed ? icon.COLLAPSE : icon.EXPAND}/>
                    </div>
                </div>
                <div className='info'>
                    { !collapsed && <DisplayResult/> }
                </div>
            </div>
        );
    }
}


export default Info;