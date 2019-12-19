import React from 'react';
import Cell from './Cell'
import { BOARD_ROWS, BOARD_COLS, CELL_SIZE } from '../constants/constants'

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
                        row={i} 
                        col={i} 
                        content={this.props.content.value(i,j)} 
                        onDrop={(pipe)=> this.props.onDrop(i, j, pipe)}>
                    </Cell>
                );
            }
            rows.push(<div style={{ display: 'flex', flex: "1 0 0" }} key={i}>{cells}</div>)
        }
        return rows
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', width: `${CELL_SIZE * BOARD_COLS}rem`, height: `${CELL_SIZE * BOARD_ROWS}rem`}}>
                {this.createRows()}
            </div>
        )
    }
}