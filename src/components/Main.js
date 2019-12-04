import React from 'react';
import Cell from './Cell'
import Toolbox from './Toolbox.js'
import Board from './Board.js'
import { Button, Card, Form } from 'react-bootstrap';

export default class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            content: this.initContent()
        };
        this.onDrop = this.onDrop.bind(this);
    }

    initContent() {
        var rows = [];
        for (let i = 0; i < 5; i++) {
            let cells = []
            for (let j = 0; j < 5; j++) {
                cells.push("empty");
            }
            rows.push(cells)
        }
        return rows
    }

    onDrop(row, col, item) {
        var content = this.state.content;
        content[row][col] = item;
        this.setState({
            content: content
        });
    }

    createRows() {
        let rows = []

        for (let i = 0; i < 5; i++) {
            let cells = []
            for (let j = 0; j < 5; j++) {
                cells.push(<Cell key={i + "-" + j} row={i} col={i} droppedItem={this.state.content[i][j]} onDrop={(item) => this.onDrop(i, j, item)}></Cell>);
            }
            rows.push(<tr key={i}>{cells}</tr>)
        }
        return rows
    }

    render() {
        return (
            <div>
                <Toolbox />
                <Board />
                <Card style={{ width: '50rem' }}>
                    <Card.Body>
                        <Button variant="primary">Compilar</Button>
                        <Form.Control as="textarea" rows="3" />
                    </Card.Body>
                </Card>
            </div>

        )
    }
}