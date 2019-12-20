import React from 'react';
import { Button, Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import Pipe from './pipes/Pipe';
import { DIRECTION, TOOLBOX_BTN_SIZE, METHOD_FUNCTION } from '../constants/constants'
import { FuncPipe } from '../classes/pipes/funcPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ValPipe } from '../classes/pipes/valPipe';
import { DummyPipe } from '../classes/pipes/dummyPipe'
import { VarPipe } from '../classes/pipes/varPipe'

const PipeGroups = {
    'mat': {
        label: 'Matematica',
        pipes: [
            new FuncPipe(METHOD_FUNCTION.ADD, [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
            new FuncPipe(METHOD_FUNCTION.SUB, [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
            new FuncPipe(METHOD_FUNCTION.MUL, [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
            new FuncPipe(METHOD_FUNCTION.DIV, [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
         ]
    },
    'val': { 
        label: 'Valores',
        pipes: [
            new ValPipe(3, DIRECTION.BOTTOM),
            new EndPipe(DIRECTION.TOP),
            new VarPipe(DIRECTION.BOTTOM),
        ],
    },
    'dummy': {
        label: 'Conetores',
        pipes: [
            new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM),
            new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT)
        ]
    }
}
const renderPipeCol = (pipe, index) => (
    <Col key={index} style={{padding:'2px',margin:'2px'}}>
        <Button variant="outline-primary">
            <Pipe pipe={pipe} size={TOOLBOX_BTN_SIZE}></Pipe>
        </Button>
    </Col>
)

const renderPipeGroup = (pipes, index, pipeGroups) => {
    return <React.Fragment key={index}>
        {pipes.map(renderPipeCol)}
    </React.Fragment>
}

export default class Toolbox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: 'val'
        }
    }

    render() {
        return (
            <Card>
                <Card.Header as="h5">Toolbox</Card.Header>
                { Object.keys(PipeGroups).map(name => 
                    <Button key={name} onClick={()=> this.setState({select: name})}>{PipeGroups[name].label}</Button>
                ) }
                <Card.Body>
                    <Row>
                        <Col sm={9}>
                            <Row>
                                { renderPipeGroup(PipeGroups[this.state.select].pipes) }
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}