import React from 'react';
import Cell from './Cell'
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants'

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
            rows.push(<tr key={i}>{cells}</tr>)
        }
        return rows
    }

    render() {
        return (
            <div style={{ display: "inline-block" }}>
                <table style={{ borderColor: "black" }}>
                    <tbody>
                        {this.createRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}