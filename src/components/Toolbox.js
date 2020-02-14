import React from 'react';
import { Button, Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Pipe from './pipes/Pipe';
import { DIRECTION, TOOLBOX_BTN_SIZE, METHOD_FUNCTION, VALUES_TYPES } from '../constants/constants'
import { FuncPipe } from '../classes/pipes/funcPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ConstPipe } from '../classes/pipes/constPipe';
import { DummyPipe } from '../classes/pipes/dummyPipe'
import { VarPipe } from '../classes/pipes/varPipe'
import './Toolbox.scss';

const PipeGroups = {
    'mat': {
        label: 'Matematica',
        pipes: [
            new FuncPipe(METHOD_FUNCTION.ADD, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.SUB, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.MUL, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.DIV, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
         ]
    },
    'val': { 
        label: 'Valores',
        pipes: [
            new ConstPipe(3),
            new EndPipe(),
            new VarPipe(),
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
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT, DIRECTION.RIGHT),
            new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT, DIRECTION.BOTTOM),
            new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT, DIRECTION.RIGHT, DIRECTION.TOP),
        ]
    },
    'figures': {
        label: 'Figuras',
        pipes: [
            new FuncPipe('circ', [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('rect', [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('linea', [VALUES_TYPES.POINT, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE),
            new FuncPipe('poli', [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('color', [VALUES_TYPES.FIGURE, VALUES_TYPES.COLOR], VALUES_TYPES.FIGURE),
            new FuncPipe('rotar', [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('juntar', [VALUES_TYPES.FIGURE, VALUES_TYPES.FIGURE], VALUES_TYPES.FIGURE),
            new FuncPipe('escalar', [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('mover', [VALUES_TYPES.FIGURE, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE)
        ]
    },
    'custom': {
        label: 'Custom',
        pipes: []
    }
}
const renderPipeCol = (pipe, index) => (
        <Button key={index} className="pipe-button" variant="outline-primary">
            <Pipe pipe={pipe} size={TOOLBOX_BTN_SIZE} origin="toolbox"/>
        </Button>
)

export default class Toolbox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select:  Object.keys(PipeGroups)[0]
        }
    }

    render() {
        const {select} = this.state;
        return (
            <div className="Toolbox">
                <div className="toolbox-header">
                { 
                    Object.keys(PipeGroups).map((name, index) => (
                        <Button key={index}
                            className={classNames("button-group", {'selected': select === name })}
                            onClick={()=> this.setState({select: name})}>
                            <span>{PipeGroups[name].label}</span>
                        </Button>
                    )) 
                }
                </div>
                <div className="toolbox-body">
                    { PipeGroups[this.state.select].pipes.map(renderPipeCol) }
                </div>
            </div>
        )
    }
}