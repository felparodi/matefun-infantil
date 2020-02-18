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



const toolboxGroups = [
    {
        value: 'mat',
        label: 'Matematica',
        pipes: [
            new ConstPipe(0),
            new FuncPipe(METHOD_FUNCTION.ADD, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.SUB, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.MUL, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            new FuncPipe(METHOD_FUNCTION.DIV, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER),
            null,
        ]
    },
    { 
        value: 'val',
        label: 'Valores',
        pipes: [
            new EndPipe(),
            new VarPipe(),
            new ConditionPipe(),
            new FuncPipe(METHOD_FUNCTION.OR, [VALUES_TYPES.BOOLEAN, VALUES_TYPES.BOOLEAN], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.EQUAL, [VALUES_TYPES.GENERIC, VALUES_TYPES.GENERIC], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.N_EQUAL, [VALUES_TYPES.GENERIC, VALUES_TYPES.GENERIC], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.GREAT, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.E_GREAT, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.LEST, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.E_LEST, [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.BOOLEAN),
            new FuncPipe(METHOD_FUNCTION.NOT, [VALUES_TYPES.BOOLEAN], VALUES_TYPES.BOOLEAN),
            null,
        ],
    },
    {
        value: 'dummy',
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
    {
        value: 'figures',
        label: 'Figuras',
        pipes: [
            new ConstPipe({color:'Rojo'}, VALUES_TYPES.COLOR),
            new ConstPipe({x:0, y:0}, VALUES_TYPES.POINT),
            new FuncPipe('circ', [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('rect', [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('linea', [VALUES_TYPES.POINT, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE),
            new FuncPipe('poli', [VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('color', [VALUES_TYPES.FIGURE, VALUES_TYPES.COLOR], VALUES_TYPES.FIGURE),
            new FuncPipe('rotar', [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('juntar', [VALUES_TYPES.FIGURE, VALUES_TYPES.FIGURE], VALUES_TYPES.FIGURE),
            new FuncPipe('escalar', [VALUES_TYPES.FIGURE, VALUES_TYPES.NUMBER], VALUES_TYPES.FIGURE),
            new FuncPipe('mover', [VALUES_TYPES.FIGURE, VALUES_TYPES.POINT], VALUES_TYPES.FIGURE),
        ]
    },
    {
        value: 'custom',
        label: 'Custom',
        pipes: [
            null,
        ]
    }
];

function toolboxPipeSnapshot(toolboxPipe) {
    return toolboxPipe.map(group => ({
            value: group.value,
            label: group.label,
            pipes: group.pipes.map((pipe) => pipe ? pipe.snapshot() : null)
        })
    );
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
            select: toolboxGroups[1].value,
            pipeToolsGroup: toolboxPipeSnapshot(toolboxGroups)
        }
    }

    render() {
        const {select, pipeToolsGroup} = this.state;
        return (
            <div className="Toolbox">
                <div className="toolbox-header">
                { 
                    pipeToolsGroup.map((toolbar, index) => (
                        <Button key={index}
                            className={classNames("button-group", {'selected': select === toolbar.value })}
                            onClick={()=> this.setState({select: toolbar.value})}>
                            <span>{toolbar.label}</span>
                        </Button>
                    )) 
                }
                </div>
                <div className="toolbox-body">
                    { pipeToolsGroup.find((toolbar) => toolbar.value === select).pipes.map(renderPipeCol) }
                </div>
            </div>
        )
    }
}