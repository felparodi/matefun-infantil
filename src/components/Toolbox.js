import React from 'react';
import { Button, Card } from 'react-bootstrap';
import Pipe from './Pipe';

export default class Toolbox extends React.Component {

    render() {
        return (
            <div style={{display:"inline-block", verticalAlign:"top"}}>
                <Card style={{ width: '18rem' }}>
                <Card.Body>
                <Card.Title>Toolbox</Card.Title>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Button variant="outline-primary">
                                    <Pipe type="cross" size="30px"></Pipe>
                                </Button>
                            </td>
                            <td>
                                <Button variant="outline-primary">
                                    <Pipe type="top-right" size="30px"></Pipe>
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button variant="outline-primary">
                                    <Pipe type="top-down" size="30px"></Pipe>
                                </Button>
                            </td>
                            <td>
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