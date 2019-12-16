import React from 'react';
import Cell from './Cell'
import Toolbox from './Toolbox.js'
import Board from './Board.js'
import { Button, Card, Form } from 'react-bootstrap';
import { MatrixPipe } from '../classes/matrix'
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants'

export default class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            boardContent: new MatrixPipe(BOARD_ROWS, BOARD_COLS),
            mfString: ''
        };
        this.onDrop = this.onDrop.bind(this);
        this.toMFString = this.toMFString.bind(this);
    }

    onDrop(row, col, pipe) {
        var boardContent = this.state.boardContent;
        boardContent.addPipe(row, col, pipe);
        this.setState({
            boardContent: boardContent
        });
    }
    
    toMFString() {
        var boardContent= this.state.boardContent;
        var mfString= boardContent.processFunction();
        this.setState({
            mfString: mfString
        })
    }

    render() {
        return (
            <div>
                <Toolbox />
                <Board content={this.state.boardContent} onDrop={this.onDrop}/>
                <Card style={{ width: '50rem' }}>
                    <Card.Body>
                        <Button variant="primary" onClick={this.toMFString}>To Matefun String</Button>
                        <Form.Control as="textarea" readOnly rows="3" value={this.state.mfString}/>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}