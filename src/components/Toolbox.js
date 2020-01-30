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
        label: 'Conectores',
        pipes: [
            new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM),
            new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT),
        ]
    },
    'dummyMult': {
        label: 'Conectores M',
        pipes: [
            new DummyPipe(DIRECTION.BOTTOM, [DIRECTION.LEFT, DIRECTION.RIGHT]),
            new DummyPipe(DIRECTION.TOP, [DIRECTION.LEFT, DIRECTION.RIGHT]),
            new DummyPipe(DIRECTION.TOP, [DIRECTION.LEFT, DIRECTION.BOTTOM]),
            new DummyPipe(DIRECTION.TOP, [DIRECTION.RIGHT, DIRECTION.BOTTOM]),
            new DummyPipe(DIRECTION.BOTTOM, [DIRECTION.LEFT, DIRECTION.RIGHT, DIRECTION.TOP]),
        ]
    },
    'color': {
        label: 'Color',
        pipes: [
            new FuncPipe('color', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM])
            //new FuncPipe(METHOD_FUNCTION.ADD, [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM]),
            //new FuncPipe(METHOD_FUNCTION.ADD, [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM])
        ]
    }
}
const renderPipeCol = (pipe, index) => (
    <Col key={index} style={{padding:'2px',margin:'2px'}}>
        <Button variant="outline-primary">
            <Pipe pipe={pipe} size={TOOLBOX_BTN_SIZE} origin="toolbox"></Pipe>
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
            select: 'dummyMult'
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
                        { renderPipeGroup(PipeGroups[this.state.select].pipes) }
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}