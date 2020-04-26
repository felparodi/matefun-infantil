import React from 'react';
import { connect } from 'react-redux';
import { dropPipe, loadPendingBoard, startWork, endWork, addWorkingPipe, join} from '../../api/board';
import Cell from './Cell'
import './Board.scss';


export class Board extends React.Component {

    constructor(props) {
        super();
        this.onDrop = this.onDrop.bind(this);
        this.addWPipe = this.addWPipe.bind(this);
    }


    addWPipe(x, y) {
        this.props.addWorkingPipe(x, y);
    }

    onDrop(drop) {
        this.props.dropPipe(drop);
    }


    componentDidMount() {
        if(this.props.hasPending) {
            this.props.loadPendingBoard();
        }
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
    hasPending: state.matrix.hasPending,
    isWorking: state.matrix.isWorking,
});

const mapDispatchToProps = {
    dropPipe,
    loadPendingBoard,
    startWork,
    endWork,
    addWorkingPipe,
    join
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);