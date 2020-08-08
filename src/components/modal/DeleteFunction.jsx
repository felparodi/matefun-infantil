import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteMyFunction } from '../../api/matefun';
import Pipe from '../pipes/Pipe';
import Icon from '../../components/Icon';
import * as icons from '../../constants/icons';

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
        this.props.deleteMyFunction(pipe.name);
        this.setState({ open :false });
        onHide && onHide();
    }

    render() {
        const { open } = this.state;
        const modalProps = {...this.props}
        const { pipe } = this.props;
        delete modalProps.pipe;
        delete modalProps.deleteMyFunction;
        return ( 
            <Modal 
                {...modalProps}
                show={open}
                className="DeleteFunction">
                <Modal.Header style={{backgroundColor: '#C2F1F2'}} closeButton>
                    <h5 style={{marginBottom: '0px'}}><Icon icon={icons.TRASH}/> Borrar función</h5>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Desea borrar la función <span>{pipe.name}</span>?</p>
                    <Pipe pipe={pipe}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="mf-primary-button" onClick={this.deleteFunction}>Borrar</Button>
                    <Button variant="secondary" className="mf-secondary-button" onClick={this.cancel}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchFunction = {
    deleteMyFunction,
}

export default connect(mapStateToProps, mapDispatchFunction)(DeleteFunction);
