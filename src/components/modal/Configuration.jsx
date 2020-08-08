import React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { closeConfig, setComplex } from '../../api/config';
import { cleanMyFunctions } from '../../api/matefun';
import './Configuration.scss';
import Icon from '../icons/Icon';
import * as icon from '../../constants/icons';

const ComplexSelect = ({ onChange, value }) => (
    <Form.Group>
        <Form.Label>Seleccionar dificultad</Form.Label>
        <Form.Control as="select" value={value} onChange={onChange}>
            <option value={0}>Básico</option>
            <option value={3}>Avanzado</option>
            <option value={5}>Completo</option>
        </Form.Control>
    </Form.Group>
)

export class Configuration extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {open, complex} = this.props;
        return (
            <Modal className="Configuration" 
                show={open}
                onHide={() => this.props.closeConfig()}>
                <Modal.Header style={{backgroundColor: '#C2F1F2'}} closeButton>
                    <h5 style={{marginBottom: '0px'}}><Icon icon={icon.CONFIG}/> Configuración</h5>
                </Modal.Header>
                <div className="body">
                    <div className="actions">
                        <ComplexSelect value={complex} onChange={(event) => this.props.setComplex(event.target.value)}/>
                        <hr></hr>
                        <Form.Group>
                            <Form.Label>Acciones</Form.Label>
                            <div>
                                <Button variant="primary" className="mf-primary-button" onClick={() => this.props.cleanMyFunctions()}>Limpiar mis funciones</Button>
                            </div>
                        </Form.Group>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    open: state.config.openModal,
    complex: state.config.complex,
});

const mapDispatchFunction = {
    closeConfig,
    cleanMyFunctions,
    setComplex
}

export default connect(mapStateToProps, mapDispatchFunction)(Configuration);
