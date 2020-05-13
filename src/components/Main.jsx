import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Toolbox from './Toolbox/Toolbox'
import Board from './Board/Board'
import Actions from './Actions';
import Header from './Header';
import { prepareEnvironment } from '../api/matefun';
import { DisplayResult } from './DisplayResult';
import { Button } from 'react-bootstrap';
import Icon from './Icon';
import * as icon from '../constants/icons';
import Info from './Info';

import './Main.scss';
import Configuration from './modal/Configuration';

export class Main extends React.Component {
    constructor() {
        super();
        this.state= {
            pipe: undefined,
            showResult: false,
            resultPanelOpen: true,
        }
        this.displayResult= this.displayResult.bind(this);
        this.openCloseResultPanel= this.openCloseResultPanel.bind(this);
    }

    componentDidMount() {
        var userData = this.props.userData;
        this.props.prepareEnvironment(userData);
    }

    displayResult(pipe){
        this.setState({pipe: pipe, showResult: true});
    }

    openCloseResultPanel() {
        this.setState({resultPanelOpen: !this.state.resultPanelOpen});
    }

    render() {
        var pipe= this.state.pipe;
        var showResult= this.state.showResult;
        return (
            <div className="Main">
                <Header />
                <div className="container">
                    <div className="body">
                        <div className="sidebar">
                            <Toolbox onDrop={this.onDropToolbox} />
                            <div className="trash drop-zone">
                                <Icon icon={icon.TRASH} size='30px'></Icon>
                            </div>
                        </div>
                        <div className="content">
                            <Actions />
                            <div className="board-container"> 
                                <Board displayResult={this.displayResult}/>
                            </div>
                        </div>                   
                        <div className={classNames('info', {
                                    'open': this.state.resultPanelOpen,
                                    'close': !this.state.resultPanelOpen
                                })}>
                            <Info 
                                closeOpenPanel={this.openCloseResultPanel}
                                collapsed={!this.state.resultPanelOpen}/>
                        </div>
                    </div>
                </div>
                <Configuration/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
}

const mapDispatchToProps = {
    prepareEnvironment
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);
