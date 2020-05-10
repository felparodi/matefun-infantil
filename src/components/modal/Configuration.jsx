import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { closeConfig, setComplex } from '../../api/config';
import { cleanMyFunctions } from '../../api/matefun';
import './Configuration.scss';

const ComplexSelect = ({ onChange, value }) => (
    <div>
        <label>Selecionar Dificulatd</label>
        <select value={value} onChange={onChange}>
            <option value={0}>Basico</option>
            <option value={3}>Avanzado</option>
            <option value={5}>Completo</option>
        </select>
    </div>
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
                <p className="title">Configuracion</p>
                <div className="body">
                    <div className="actions">
                        <ComplexSelect value={complex} onChange={(event) => this.props.setComplex(event.target.value)}/>
                        <p>Acciones</p>
                        <button onClick={() => this.props.cleanMyFunctions()}>Limpiar mis funciones</button>
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
