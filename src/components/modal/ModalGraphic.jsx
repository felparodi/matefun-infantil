import React from 'react';
import { Modal } from 'react-bootstrap';
import MateFun2D from '../graph/MateFun2D';
import Icon from '../icons/Icon';
import * as icons from '../../constants/icons';

import './ModalGraphic.scss';


export class ModalGraphic extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {open, value, type, onClose} = this.props;
        return (
            <Modal className="ModalGraphic" 
                show={open}
                onHide={onClose}>
                <MateFun2D value={value} type={type}/>
                <button className="btn-close" onClick={onClose}><Icon icon={icons.CANCEL}/></button>
            </Modal>
        )
    }
}


export default ModalGraphic;
