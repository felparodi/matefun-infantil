import React from 'react';
import Cell from './Cell'
import './Board.scss';
export default class Board extends React.Component {

    constructor(props) {
        super();
    }

    createRows() {
        const { content } = this.props;
        let rows = [];
        for (let i = 0; i < content.length; i++) {
            let cells = []
            for (let j = 0; j < content[i].length; j++) {
               
                cells.push(
                    <Cell 
                        key={i + "-" + j} 
                        content={this.props.content[i][j]} 
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