import React from 'react';
import { connect } from 'react-redux';
import { addPipe, movePipe, removePipe, addWorkingPipe, join} from '../../api/board';
import Cell from './Cell'
import './Board.scss';


export class Board extends React.Component {

    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.addWPipe = this.addWPipe.bind(this);
        this.displayResult= this.displayResult.bind(this);
    }

    displayResult(pipe){
        this.props.displayResult(pipe);
    }

    addWPipe(x, y) {
        this.props.addWorkingPipe(x, y);
    }

    onDrop(drop) {
        const { origin, pos, dropEffect, pipe } = drop;
        if(origin !== 'board') {
            this.props.removePipe(pipe);
        } else if(!pipe.pos || dropEffect === 'copy') {
            this.props.addPipe(pos, pipe);
        } else if (dropEffect === 'move') {
            this.props.movePipe(pos, pipe);
        }
    }

    createRows() {
        const { content, selectedCell } = this.props;
        let rows = [];
        for (let i = 0; i < content.length; i++) {
            let cells = []
            for (let j = 0; j < content[i].length; j++) {
               const content = this.props.content[i][j];
                cells.push(
                    <Cell 
                        key={i + "-" + j} 
                        selected={selectedCell && selectedCell.x === i && selectedCell.y === j}
                        content={content}
                        posX={i}
                        posY={j}
                        onDoubleClick={() => this.addWPipe(i, j)}
                        displayResult={this.displayResult}
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
    isWorking: state.matrix.isWorking,
    selectedCell: state.matrix.selectedCell
});

const mapDispatchToProps = {
    addPipe,
    movePipe,
    removePipe,
    addWorkingPipe,
    join,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);