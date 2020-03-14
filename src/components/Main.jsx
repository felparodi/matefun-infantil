import React from 'react';
import {connect} from 'react-redux';
import Cell from './Cell'
import Toolbox from './Toolbox'
import Board from './Board'
import Actions from './Actions';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import * as services from '../services';
import './Main.scss';

export class Main extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="Main">
                <Header userData={this.props.userData} onLogout={this.props.onLogout}/>
                <div className="container">
                    <div className="body">
                        <div className="toolbox-container">
                            <Toolbox onDrop={this.onDropToolbox} />
                        </div>
                        <div className="board-container">
                            <Board/>
                        </div>
                    </div>
                    <Actions/>
                </div>
            </div>
        )
    }
}


export default Main;
