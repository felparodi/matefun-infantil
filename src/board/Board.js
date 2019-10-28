import React from 'react';
import { Button, Card } from 'react-bootstrap';
import Cross from '../svg/Cross'
import TopRight from '../svg/TopRight'

export default class Board extends React.Component {

    createRows() {
        let rows = []

        // Outer loop to create parent
        for (let i = 0; i < 5; i++) {
            let cells = []
            //Inner loop to create children
            for (let j = 0; j < 5; j++) {
                cells.push(<td key={[i,j]} style={{border:"1px solid black",width:"80px",height:"80px"}}></td>)
            }
            //Create the parent and add the children
            rows.push(<tr key={i}>{cells}</tr>)
        }
        return rows
    }

    render() {
        return (
            <div style={{display:"inline-block"}}>
                <table style={{ borderColor: "black" }}>
                    <tbody>
                        {this.createRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}