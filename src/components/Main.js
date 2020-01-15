import React from 'react';
import Cell from './Cell'
import Toolbox from './Toolbox.js'
import Board from './Board.js'
import { Container, Navbar, Nav, Row, Col, Button, Card, Form, FormControl } from 'react-bootstrap';
import { MatrixPipe } from '../classes/matrix'
import { BOARD_ROWS, BOARD_COLS } from '../constants/constants'
import * as services from '../services';

export default class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            boardContent: new MatrixPipe(BOARD_ROWS, BOARD_COLS),
            mfString: ''
        };
        this.onDrop = this.onDrop.bind(this);
        this.toMFString = this.toMFString.bind(this);
        this.trywebsocket = this.trywebsocket.bind(this);
    }


    componentDidMount() {

        services.loginInvitado(
            (userData) => {

                this.setState({ userData: userData });

                services.crearArchivo(
                    (fileData) => {

                        this.setState({ fileData: fileData });

                        fileData.contenido = 'fun :: R X R -> R↵fun (x,y,z)= x + y + z↵↵';

                        services.editarArchivo(fileData,
                            (response) => {
                                console.log('end');
                            })

                    });

                // instance of websocket connection as a class property
                this.ws = new WebSocket('ws://localhost:8080/endpoint' + '/' + userData.cedula + '/' + userData.token + '/es');
                // this.connection = new WebSocket(wsUrl+"/"+cedula+"/"+token+"/"+language);

                this.ws.onopen = () => {
                    // on connecting, do nothing but log it to the console
                    console.log('connected')
                }

                this.ws.onmessage = evt => {
                    // listen to data sent from the websocket server
                    const message = JSON.parse(evt.data)
                    this.setState({ dataFromServer: message })
                    console.log(message)
                }

                this.ws.onclose = () => {
                    console.log('disconnected')
                    // automatically try to reconnect on connection loss

                }

            });
    }

    onDrop(row, col, pipe) {
        var boardContent = this.state.boardContent;
        boardContent.addPipe(row, col, pipe.clone());
        this.setState({
            boardContent: boardContent
        });
    }

    trywebsocket() {
        var userData = this.state.userData;
        this.ws.send('{"token":"' + userData.token + '","load":11,"dependencias":[11]}'); // load file 11 (the one that defines the function 'fun')
        this.ws.send('{"token":"'+userData.token+'","comando":"fun(3,4)"}'); //send data to the server
    }

    toMFString() {
        var boardContent = this.state.boardContent;
        var mfString = boardContent.process();
        this.setState({
            mfString: mfString
        })
    }

    render() {
        return (
            <div>
                <Container style={{ maxWidth: '100%' }}>
                    <Navbar bg="primary" variant="dark" style={{ marginBottom: '15px' }}>
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
                                        <Button variant="primary" onClick={this.trywebsocket}>Try websocket</Button>
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