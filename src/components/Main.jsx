import React from 'react';
import { connect } from 'react-redux';

import Toolbox from './Toolbox/Toolbox'
import Board from './Board/Board'
import Actions from './Actions';
import Header from './Header';
import { prepareEnvironment } from '../api/matefun';
import { DisplayResult } from './modal/DisplayResult';
import { Container, Row, Col } from 'react-bootstrap';

import './Main.scss';
import Configuration from './modal/Configuration';

export class Main extends React.Component {
    constructor() {
        super();
        this.state= {
            pipe: undefined,
            showResult: false
        }
        this.displayResult= this.displayResult.bind(this);
    }

    componentDidMount() {
        var userData = this.props.userData;
        this.props.prepareEnvironment(userData);
    }

    displayResult(pipe){
        this.setState({pipe: pipe, showResult: true});
    }

    render() {
        var pipe= this.state.pipe;
        var showResult= this.state.showResult;
        return (
            <div className="Main">
                <Header />
                <div className="container">
                    <div className="body">
                        <div className="col-sm-7">
                            <div className="panel">
                                <div className="row" style={{height:'100%'}}>
                                    <div className="toolbox-container col-sm-2">
                                        <Toolbox onDrop={this.onDropToolbox} />
                                    </div>
                                    <div className="col-sm-10" style={{height:'100%'}}>
                                        <Actions />
                                        <div class="board-container"> 
                                            <Board displayResult={this.displayResult}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                    
                        <div className="col-sm-5">
                            <div className="panel">
                            {pipe && 
                                <DisplayResult 
                                    show={showResult}
                                    value={pipe.value}
                                    type={pipe.dir.top}
                                    valuetext={pipe.valueText}
                                    hasError={pipe.hasValueError}
                                    onHide={this.handlerHiddenResult} />
                            }
                            </div>
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
