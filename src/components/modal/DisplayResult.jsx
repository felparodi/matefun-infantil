import React from 'react';
import {VALUES_TYPES} from '../../constants/constants';
import { Modal } from 'react-bootstrap';
import MateFun2D from '../graph/MateFun2D';
import './DisplayResult.scss';

export class DisplayResult extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { props } = this;
        const { value, valuetext, type} = props;
        return (
            <Modal className="DisplayResult" {...props}>
                { 
                    type  === VALUES_TYPES.FIGURE ?
                    <MateFun2D value={value}/> :
                    <textarea className="info result" readOnly value={valuetext}/>
                }
            </Modal>
        )
    }
}