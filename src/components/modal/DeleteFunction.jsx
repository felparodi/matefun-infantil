import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { deleteMyFunctions } from '../../api/matefun';
import Pipe from '../pipes/Pipe';

import './DeleteFunction.scss';

export class DeleteFunction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.cancel = this.cancel.bind(this);
        this.deleteFunction = this.deleteFunction.bind(this);
    }

    componentDidMount() {
        this.setState({ open: this.props.show });
    }

    componentDidUpdate(prevProp) {
        if(prevProp.show !== this.props.show) {
            this.setState({ open: this.props.show })
        }
    }

    cancel() {
        const { onHide } = this.props;
        this.setState({ open :false });
        onHide && onHide();
    }

    deleteFunction() {
        const {pipe, onHide} = this.props;
        this.props.deleteMyFunctions(pipe.name);
        this.setState({ open :false });
        onHide && onHide();
    }

    render() {
        const { open } = this.state;
        const modalProps = {...this.props}
        const {pipe} = this.props;
        delete modalProps.pipe;
        return ( 
            <Modal 
                {...modalProps}
                show={open}
                className="DeleteFunction">
                <Modal.Body>
                    <p>Desea Borrar la Funcion <span>{pipe.name}</span>?</p>
                    <Pipe pipe={pipe}/>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.cancel}>Cancelar</button>
                    <button onClick={this.deleteFunction}>Borrar</button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchFunction = {
    deleteMyFunctions,
}

export default connect(mapStateToProps, mapDispatchFunction)(DeleteFunction);
