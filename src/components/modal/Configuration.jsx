import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { closeConfig } from '../../api/config';
import { cleanMyFunctions } from '../../api/matefun';
import './Configuration.scss';

export class Configuration extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {open} = this.props;
        return (
            <Modal className="Configuration" 
                show={open}
                onHide={() => this.props.closeConfig()}>
                <p className="title">Configuracion</p>
                <div className="body">
                    <div className="actions">
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
});

const mapDispatchFunction = {
    closeConfig,
    cleanMyFunctions
}

export default connect(mapStateToProps, mapDispatchFunction)(Configuration);
