import React from 'react';
import { Button, Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Pipe from './pipes/Pipe';
import { DIRECTION, METHOD_FUNCTION, VALUES_TYPES } from '../constants/constants'
import { FuncPipe } from '../classes/pipes/funcPipe';
import { EndPipe } from '../classes/pipes/endPipe';
import { ConstPipe } from '../classes/pipes/constPipe';
import { DummyPipe } from '../classes/pipes/dummyPipe'
import { VarPipe } from '../classes/pipes/varPipe';
import { ConditionPipe } from '../classes/pipes/conditionPipe';
import './Toolbox.scss';

const PipeGroups = {
    'mat': {
        label: 'Matematica',
        pipes: [
            new ConstPipe(0).snapshot(),
            new FuncPipe(METHOD_FUNCTION.ADD, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER).snapshot(),
            new FuncPipe(METHOD_FUNCTION.SUB, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER).snapshot(),
            new FuncPipe(METHOD_FUNCTION.MUL, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER).snapshot(),
            new FuncPipe(METHOD_FUNCTION.DIV, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER).snapshot(),
            null,
        ]
    },
    'val': { 
        label: 'Valores',
        pipes: [
            new EndPipe().snapshot(),
            new VarPipe().snapshot(),
            new ConditionPipe().snapshot(),
            new FuncPipe(METHOD_FUNCTION.OR, [VALUES_TYPES.BOOLEAN, VALUES_TYPES.BOOLEAN], VALUES_TYPES.BOOLEAN).snapshot(),
            new FuncPipe(METHOD_FUNCTION.EQUAL, [VALUES_TYPES.GENERIC, VALUES_TYPES.GENERIC], VALUES_TYPES.BOOLEAN).snapshot(),
            new FuncPipe(METHOD_FUNCTION.N_EQUAL, [VALUES_TYPES.GENERIC, VALUES_TYPES.GENERIC], VALUES_TYPES.BOOLEAN).snapshot(),
            new FuncPipe(METHOD_FUNCTION.GREAT, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN).snapshot(),
            new FuncPipe(METHOD_FUNCTION.E_GREAT, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN).snapshot(),
            new FuncPipe(METHOD_FUNCTION.LEST, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN).snapshot(),
            new FuncPipe(METHOD_FUNCTION.E_LEST, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN).snapshot(),
            new FuncPipe(METHOD_FUNCTION.NOT, [VALUES_TYPES.BOOLEAN], VALUES_TYPES.BOOLEAN).snapshot(),
            null,
        ],
    },
    'dummy': {
        label: 'Conectores',
        pipes: [
            new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM).snapshot(),
            new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT).snapshot(),
            new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT).snapshot(),
            new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT).snapshot(),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.RIGHT).snapshot(),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT).snapshot(),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT, DIRECTION.RIGHT).snapshot(),
            new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT, DIRECTION.RIGHT).snapshot(),
            new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT, DIRECTION.BOTTOM).snapshot(),
            new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM).snapshot(),
            new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT, DIRECTION.RIGHT, DIRECTION.TOP).snapshot(),
        ]
    },
    'figures': {
        label: 'Figuras',
        pipes: [
            new ConstPipe({color:'rojo'}, VALUES_TYPES.COLOR).snapshot(),
            new ConstPipe({x:0, y:0}, VALUES_TYPES.POINT).snapshot(),
            new FuncPipe('circ', [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('rect', [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('linea', [VALUES_TYPES.POINT, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('poli', [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('color', [VALUES_TYPES.FIGURE, VALUES_TYPES.COLOR], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('rotar', [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('juntar', [VALUES_TYPES.FIGURE, VALUES_TYPES.FIGURE], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('escalar', [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE).snapshot(),
            new FuncPipe('mover', [VALUES_TYPES.FIGURE, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE).snapshot(),
        ]
    },
    'custom': {
        label: 'Custom',
        pipes: [
            null,
        ]
    }
}

const renderPipeCol = (pipe, index) => (
    <Button key={index} className="pipe-button" variant="outline-primary">
        <Pipe pipe={pipe} origin="toolbox"/>
    </Button>
)

export default class Toolbox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select:  Object.keys(PipeGroups)[1]
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