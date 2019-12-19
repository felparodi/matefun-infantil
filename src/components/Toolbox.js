import React from 'react';
import { Button, Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import Pipe from './pipes/Pipe';
import { DIRECTION, TOOLBOX_BTN_SIZE } from '../constants/constants'
import { FuncPipe } from '../classes/pipes/funcPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ValPipe } from '../classes/pipes/valPipe';
import { DummyPipe } from '../classes/pipes/dummyPipe'
import { VarPipe } from '../classes/pipes/varPipe'

const PipeGroups = [
    [
        new FuncPipe('add', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
        new FuncPipe('sub', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
        new FuncPipe('mul', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
        new FuncPipe('div', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
    ],
    [
        new ValPipe(3, DIRECTION.BOTTOM),
        new EndPipe(DIRECTION.TOP),
        new VarPipe(DIRECTION.BOTTOM),
    ],
    [
        new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM),
        new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT),
        new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT),
        new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT),
        new DummyPipe(DIRECTION.BOTTOM, DIRECTION.RIGHT),
        new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT)
    ]
]

const renderPipeCol = (pipe) => (
    <Col style={{padding:'2px',margin:'2px'}}>
        <Button variant="outline-primary">
            <Pipe pipe={pipe} size={TOOLBOX_BTN_SIZE}></Pipe>
        </Button>
    </Col>
)

const renderPipeGroup = (pipes, index, pipeGroups) => {
    return <React.Fragment>
        {pipes.map(renderPipeCol)}
        { index + 1 < pipeGroups.length && 
            <Col xs={12}>
                <hr></hr>
            </Col>
        }
    </React.Fragment>
}

export default class Toolbox extends React.Component {
    render() {
        return (
            <Card>
                <Card.Header as="h5">Toolbox</Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm={9}>
                            <Row>
                                { PipeGroups.map(renderPipeGroup) }
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}