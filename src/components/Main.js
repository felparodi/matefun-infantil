import React from 'react';
import Cell from './Cell'
import Toolbox from './Toolbox.js'
import Board from './Board.js'
import { Container, Navbar, Nav, Row, Col, Button, Card, Form, FormControl } from 'react-bootstrap';
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
        var boardContent = this.state.boardContent;
        var mfString = boardContent.processFunction();
        this.setState({
            mfString: mfString
        })
    }

    render() {
        return (
            <div>
                <Container style={{maxWidth:'100%'}}>
                    <Navbar bg="primary" variant="dark" style={{marginBottom:'15px'}}>
                        <Navbar.Brand href="#home">Matefun Infantil</Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-light">Search</Button>
                        </Form>
                    </Navbar>
                    <Row>
                        <Col sm={2}>
                            <Toolbox />
                        </Col>
                        <Col sm={10}>
                            <Row>
                                <Board content={this.state.boardContent} onDrop={this.onDrop} />
                            </Row>
                            <Row>
                                <Card style={{ width: '50rem' }}>
                                    <Card.Body>
                                        <Button variant="primary" onClick={this.toMFString}>To Matefun String</Button>
                                        <Form.Control as="textarea" readOnly rows="3" value={this.state.mfString} />
                                    </Card.Body>
                                </Card>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}