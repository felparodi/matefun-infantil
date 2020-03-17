import React from 'react';
import { connect } from 'react-redux';
import { dropPipe, loadPenndingBoard, startWork, endWork, addWorkingPipe, join} from '../api/board';
import Cell from './Cell'
import classNames from 'classnames';
import './Board.scss';
import { DIRECTION } from '../constants/constants';


export class Board extends React.Component {

    constructor(props) {
        super();
        this.handlerKeyDown = this.handlerKeyDown.bind(this);
        this.handlerKeyUp = this.handlerKeyUp.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.addWPipe = this.addWPipe.bind(this);
    }

    handlerKeyDown(e) {
        if(e.type === 'keydown') {
            switch(e.keyCode) {
            }
        }
    }

    handlerKeyUp(e) {
        if(e.type === 'keyup') {
            switch(e.keyCode) {
            }
        }
    }

    addWPipe(x, y) {
        this.props.addWorkingPipe(x, y);
    }

    onDrop(drop) {
        this.props.dropPipe(drop);
    }


    componentDidMount() {
        window.addEventListener('keydown', this.handlerKeyDown);
        window.addEventListener('keyup', this.handlerKeyUp);
        if(this.props.hasPendding) {
            //if(confirm('Desa Cargar Pendient')) {
                this.props.loadPenndingBoard();
            //}
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handlerKeyDown);
        window.removeEventListener('keyup', this.handlerKeyUp);
    }

    createRows() {
        const { content } = this.props;
        let rows = [];
        for (let i = 0; i < content.length; i++) {
            let cells = []
            for (let j = 0; j < content[i].length; j++) {
               const content = this.props.content[i][j];
                cells.push(
                    <Cell 
                        key={i + "-" + j} 
                        content={content} 
                        posX={i}
                        posY={j}
                        onDoubleClick={() => this.addWPipe(i, j)}
                        onDrop={this.onDrop}>
                    </Cell>
                );
            }
            rows.push(<div className="board-row" key={i}>{cells}</div>)
        }
        return rows
    }

    render() {
        return (
            <div className='Board'>
                {this.createRows()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    content: state.matrix.board,
    hasPendding: state.matrix.hasPendding,
    isWorking: state.matrix.isWorking,
});

const mapDispatchToProps = {
    dropPipe,
    loadPenndingBoard,
    startWork,
    endWork,
    addWorkingPipe,
    join
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);