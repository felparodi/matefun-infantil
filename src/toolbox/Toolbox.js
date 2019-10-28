import React from 'react';
import { Button, Card } from 'react-bootstrap';
import Cross from '../svg/Cross'
import TopRight from '../svg/TopRight'

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
                                    <Cross size="30px"></Cross>
                                </Button>
                            </td>
                            <td>
                                <Button variant="outline-primary">
                                    <TopRight size="30px"></TopRight>
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button variant="outline-primary">
                                    <Cross size="30px"></Cross>
                                </Button>
                            </td>
                            <td>
                                <Button variant="outline-primary">
                                    <TopRight size="30px"></TopRight>
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