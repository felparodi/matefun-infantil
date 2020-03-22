import React from 'react';
import { connect } from 'react-redux';

import Toolbox from './Toolbox'
import Board from './Board'
import Actions from './Actions';
import Header from './Header';
import * as logic from '../logic';
import * as webSocket from '../server_connection/webSocket';

import './Main.scss';

export class Main extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

        var userData = this.props.userData;

        logic.prepareEnvironment(userData, (workspaceFileData, myFunctionsFileData) => {
            this.props.prepareEnvironment(workspaceFileData, myFunctionsFileData);
        })
    }

    render() {
        return (
            <div className="Main">
                <Header />
                <div className="container">
                    <div className="body">
                        <div className="toolbox-container">
                            <Toolbox onDrop={this.onDropToolbox} />
                        </div>
                        <div className="board-container">
                            <Board />
                        </div>
                    </div>
                    <Actions />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
}

const mapDispatchToProps = dispatch => {
    return { 
        prepareEnvironment: (workspaceFileData, myFunctionsFileData) => dispatch(prepareEnvironment(workspaceFileData, myFunctionsFileData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
