import React from 'react';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import DisplayResult from './DisplayResult';
import Icon from './Icon';
import * as icon from '../constants/icons';

import './Info.scss';

export class Info extends React.Component {

    render() {
        const { closeOpenPanel, collapsed } = this.props;
        return (
            <div className={classNames("Info", { 'collapsed': collapsed })}>
                <div className="buttons">
                    <Button className='btn-collapse' onClick={closeOpenPanel}> 
                        <Icon icon={!collapsed ? icon.COLLAPSE : icon.EXPAND}/>
                    </Button>
                </div>
                { !collapsed && <DisplayResult/> }
            </div>
        );
    }
}


export default Info;