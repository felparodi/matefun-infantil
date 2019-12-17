import React from 'react';
import { Button, Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import Pipe from './pipes/Pipe';
import { DIRECTION, TOOLBOX_BTN_SIZE } from '../constants/constants'
import { FuncPipe } from '../classes/pipes/funcPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ValPipe } from '../classes/pipes/valPipe';
import { DummyPipe } from '../classes/pipes/dummyPipe'
import { VarPipe } from '../classes/pipes/varPipe'


export default class Toolbox extends React.Component {

    render() {
        return (
            <Card>
                <Card.Header as="h5">Toolbox</Card.Header>
                <Card.Body>
                    <Row>
                        {/*
                        <Col sm={3}>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                <Row>
                                    <Col sm={3}>
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">Operators</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">Dummies</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col sm={9}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first">
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">

                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Col>
                         */}
                        <Col sm={9}>
                            <Row>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new FuncPipe('add', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM])} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new FuncPipe('sub', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM])} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new FuncPipe('mul', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM])} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new FuncPipe('div', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM])} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col xs={12}>
                                    <hr></hr>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new ValPipe(3, DIRECTION.BOTTOM)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new EndPipe(DIRECTION.TOP)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new VarPipe(DIRECTION.BOTTOM)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col xs={12}>
                                    <hr></hr>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                                <Col style={{padding:'2px',margin:'2px'}}>
                                    <Button variant="outline-primary">
                                        <Pipe pipe={new DummyPipe(DIRECTION.BOTTOM, DIRECTION.RIGHT)} size={TOOLBOX_BTN_SIZE}></Pipe>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}