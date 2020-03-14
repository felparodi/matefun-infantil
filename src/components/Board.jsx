import React from 'react';
import { connect } from 'react-redux';
import { moverPipe, addPipeSnap } from '../api/board';
import Cell from './Cell'
import classNames from 'classnames';
import './Board.scss';


export class Board extends React.Component {

    constructor(props) {
        super();
        this.handlerKeyDown = this.handlerKeyDown.bind(this);
        this.handlerKeyUp = this.handlerKeyUp.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.state = {
            isCopy: false
        }
    }

    handlerKeyDown(e) {
        if(e.type === 'keydown') {
            switch(e.keyCode) {
                case 18:
                    return this.setState({isCopy: true})
            }
        }
    }

    handlerKeyUp(e) {
        if(e.type === 'keyup') {
            switch(e.keyCode) {
                case 18:
                    return this.setState({isCopy: false})
            }
        }
    }


    onDrop(row, col, pipeSnap, options) {
        console.log('onDrop', Date.now());
        if (pipeSnap) {
            if(pipeSnap.pos && !options.isCopy) {
                this.props.moverPipe(row, col, pipeSnap);
            } else {
                this.props.addPipeSnap(row, col, pipeSnap);
            }
        }
    }


    componentDidMount() {
        window.addEventListener('keydown', this.handlerKeyDown)
        window.addEventListener('keyup', this.handlerKeyUp)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handlerKeyDown)
        window.removeEventListener('keyup', this.handlerKeyUp)
    }

    createRows() {
        const { content } = this.props;
        const {isCopy} = this.state;
        let rows = [];
        for (let i = 0; i < content.length; i++) {
            let cells = []
            for (let j = 0; j < content[i].length; j++) {
               
                cells.push(
                    <Cell 
                        key={i + "-" + j} 
                        content={this.props.content[i][j]} 
                        onDrop={(pipe) => this.onDrop(i, j, pipe, {isCopy})}>
                    </Cell>
                );
            }
            rows.push(<div className="board-row" key={i}>{cells}</div>)
        }
        return rows
    }

    render() {
        const {isCopy} = this.state;
        return (
            <div className={classNames('Board',{'copy': isCopy})} >
                {this.createRows()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    content: state.matrix.board,
});

const mapDispatchToProps = {
    moverPipe,
    addPipeSnap
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)