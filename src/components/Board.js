import React from 'react';
import Cell from './Cell'
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants'
import './Board.scss';
export default class Board extends React.Component {

    constructor(props) {
        super();
    }

    createRows() {
        let rows = []
        for (let i = 0; i < BOARD_ROWS; i++) {
            let cells = []
            for (let j = 0; j < BOARD_COLS; j++) {
                cells.push(
                    <Cell 
                        key={i + "-" + j} 
                        content={this.props.content.value(i,j)} 
                        onDrop={(pipe) => this.props.onDrop(i, j, pipe)}
                        onChangeVarValue={this.props.onChangeVarValue}>
                    </Cell>
                );
            }
            rows.push(<div className="board-row" key={i}>{cells}</div>)
        }
        return rows
    }

    render() {

        return (
            <div className="Board" >
                {this.createRows()}
            </div>
        )
    }
}