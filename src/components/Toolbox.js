import React from 'react';
import { Button, Card } from 'react-bootstrap';
import Pipe from './Pipe';
import { DummyPipe } from '../status/dummyPipe.js'
import { DIRECTION } from '../constants/constants.js'
import { FuncPipe } from '../status/funcPipe';
import { EndPipe } from '../status/endPipe';

export default class Toolbox extends React.Component {

    render() {
        return (
            <div style={{ display: "inline-block", verticalAlign: "top" }}>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Toolbox</Card.Title>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new FuncPipe('add', [DIRECTION.LEFT, DIRECTION.RIGHT], [DIRECTION.BOTTOM])} size="30px"></Pipe>
                                        </Button>
                                   </td>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new EndPipe(DIRECTION.TOP)} size="30px"></Pipe>
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM)} size="30px"></Pipe>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT)} size="30px"></Pipe>
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT)} size="30px"></Pipe>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT)} size="30px"></Pipe>
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT)} size="30px"></Pipe>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary">
                                            <Pipe pipe={new DummyPipe(DIRECTION.BOTTOM, DIRECTION.RIGHT)} size="30px"></Pipe>
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}