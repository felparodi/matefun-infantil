import React from 'react';
import { connect } from 'react-redux';

import Toolbox from './Toolbox/Toolbox'
import Board from './Board/Board'
import Actions from './Actions';
import Header from './Header';
import { prepareEnvironment } from '../api/matefun';

import './Main.scss';
import Configuration from './modal/Configuration';

export class Main extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        var userData = this.props.userData;
        this.props.prepareEnvironment(userData);
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
