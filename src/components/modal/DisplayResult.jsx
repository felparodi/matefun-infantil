import React from 'react';
import { Modal } from 'react-bootstrap';
import MateFun2D from '../graph/MateFun2D';
import './DisplayResult.scss';

export class DisplayResult extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { props } = this;
        const { value, valuetext } = props;
        return (
            <Modal className="DisplayResult" {...props}>
                { 
                    !value || value.tipo === 'salida' ?
                    <p className="text-value">{ valuetext }</p>
                 : <MateFun2D value={value}/>
                }
            </Modal>
        )
    }
}