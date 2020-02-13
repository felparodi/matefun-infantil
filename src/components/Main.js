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
            functionDeclaration: '',
            functionEvaluation: '',
            waitingForResult: false,
            fileData: {},
        };
        this.onDrop = this.onDrop.bind(this);
        this.process = this.process.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.onChangeVarValue = this.onChangeVarValue.bind(this);
        this.setResult= this.setResult.bind(this);
    }


    componentDidMount() {

        services.loginInvitado(
            (userData) => {

                this.setState({ userData: userData });

                services.crearArchivo(
                    (fileData) => {

                        this.setState({ fileData: fileData });
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
                    if (this.state.waitingForResult && message.tipo=="salida" && message.resultado.startsWith("OUT")){
                        var resultValue= message.resultado.substring(3);
                        
                        var boardContent= this.state.boardContent;
                        boardContent.setResultValue(resultValue);

                        this.setState({ 
                            waitingForResult: false,
                            boardContent: boardContent.clone()
                            //boardContent: boardContent
                        },()=>console.log('hey'))
                    }
                }

                this.ws.onclose = () => {
                    console.warn('disconnected')
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

    onChangeVarValue(x, y, value) {
        var boardContent = this.state.boardContent;

        boardContent.setPipeValue(x, y, value);

        this.setState({
            boardContent: boardContent
        });
    }

    process() {
        var boardContent = this.state.boardContent;

        var functionDeclaration = boardContent.process();
        this.setState({
            functionDeclaration: functionDeclaration
        })

        var fileData = this.state.fileData;

        fileData.contenido = functionDeclaration;

        services.editarArchivo(fileData,
            (response) => {

                var userData = this.state.userData;

                this.ws.send('{"token":"' + userData.token + '","load":' + fileData.id + ',"dependencias":[' + fileData.id + ']}');
            })
    }

    evaluate() {
        var boardContent = this.state.boardContent;

        var functionEvaluation = boardContent.evaluateFunction();
        
        this.setState({
            functionEvaluation: functionEvaluation,
            waitingForResult: true
        }, () => {
            this.ws.send('{"token":"' + this.state.userData.token + '","comando":"' + functionEvaluation + '"}'); //send data to the server
        })

    }

    setResult() {
        var boardContent = this.state.boardContent;

        boardContent.setResultValue(5);

        this.setState({boardContent: boardContent});
    }

    render() {
        //console.log('render Main')
        //console.log(this.state.boardContent)
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
                                <Board content={this.state.boardContent} onDrop={this.onDrop} onChangeVarValue={this.onChangeVarValue} />
                            </Row>
                            <Row>
                                <Card style={{ width: '50rem' }}>
                                    <Card.Body>
                                        <Button variant="primary" onClick={this.process}>Procesar</Button>
                                        <Form.Control as="textarea" readOnly rows="3" value={this.state.functionDeclaration} />
                                        <Button variant="primary" onClick={this.evaluate}>Evaluar</Button>
                                        <Form.Control as="textarea" readOnly rows="3" value={this.state.functionEvaluation} />
                                        <Button variant="primary" onClick={this.setResult}>Set result</Button>
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