import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { saveInMyFunctions } from '../../api/matefun';
import './Configuration.scss';

export class CreateFunction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            name: '',
            icon: '',
        }
        this.saveFunction = this.saveFunction.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
    }

    componentDidMount() {
        this.setState({ open: this.props.show });
    }

    componentDidUpdate(prevProp) {
        if(prevProp.show !== this.props.show) {
            this.setState({ open: this.props.show })
        }
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    saveFunction() {
        const { name } = this.state;
        this.props.saveInMyFunctions(name.trim());
        this.setState({open: false});
        this.props.onHide();
    }

    render() {
        const { open,name } = this.state;
        return (
            <Modal 
                {...this.props}
                show={open}
                className="CreateFunction">
                <Modal.Header>Nueva Funcion</Modal.Header>
                <Modal.Body>
                    <div><span>Nomber:</span><input tyep='text' maxLength={10} onChange={this.onChangeName}/></div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.saveFunction}>Salvar</button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchFunction = {
    saveInMyFunctions
}

export default connect(mapStateToProps, mapDispatchFunction)(CreateFunction);
