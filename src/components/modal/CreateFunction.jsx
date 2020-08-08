import React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { saveMyFunction } from '../../api/matefun';
import * as icons from '../../constants/icons';
import Base from '../pipes/function-parts/Base';
import FunctionDescriptor from '../pipes/function-parts/FunctionDescriptor';
import './CreateFunction.scss';
import Icon from '../../components/Icon';

const ICONS = [
    //random objects
    icons.SNOWMAN,
    icons.UMBRELLA,
    icons.HEART,
    icons.DICE,
    icons.CROWN,
    //astronomy
    icons.MOON,
    icons.STAR,
    icons.SUN,
    //food
    icons.HAMBURGER,
    icons.PIZZA,
    icons.ICE_CREAM,
    //transport
    icons.PLANE,
    icons.CAR,
    icons.BICYCLE,
    //animals
    icons.DOG,
    icons.CAT,
    icons.SPIDER,
    icons.FISH,
    //music
    icons.MUSIC,
    icons.DRUM,
    icons.GUITAR,
    //sports
    icons.BASKETBALL_BALL,
    //wearable
    icons.COWBOY_HAT,
    icons.GLASSES,
    icons.TSHIRT,
    icons.SOCKS,
    icons.MASK
];

const ButtonIcon = ({icon, onClick, selected }) => {
    return (
        <div className={classNames('ButtonIcon', {'selected':selected })}>
            <svg viewBox="0 0 40 40" onClick={() => onClick & onClick(icon)}>
                <Base/>
                <FunctionDescriptor icon={icon} />
            </svg>
        </div>
    );
}

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
            this.setState({ open: this.props.show, name: '' , icon: ''})
        }
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    saveFunction() {
        const { name, icon } = this.state;
        this.props.saveMyFunction(name.trim(), icon);
        this.setState({open: false});
        this.props.onHide();
    }

    render() {
        const { open, name, icon } = this.state;
        const modalProps = {...this.props}
        delete(modalProps.saveMyFunction);
        return (
            <Modal 
                {...modalProps}
                show={open}
                className="CreateFunction">
                <Modal.Header style={{backgroundColor: '#C2F1F2'}} closeButton>
                    <h5 style={{marginBottom: '0px'}}><Icon icon={icons.SAVE}/> Guardar función</h5>
                </Modal.Header>
                <div className="body">
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" maxLength={10} value={name} onChange={this.onChangeName}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Seleccionar ícono</Form.Label>
                        <div className="icons">
                            { ICONS.map((iconName) => <ButtonIcon 
                                                        key={iconName} 
                                                        onClick={() => this.setState({icon: iconName != icon ? iconName : ''})}
                                                        icon={iconName} 
                                                        selected={iconName === icon}/>)}
                        </div>
                    </Form.Group>
                </div>
                <Modal.Footer>
                    <Button variant="primary" className="mf-primary-button" disabled={!icon && !name} onClick={this.saveFunction}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchFunction = {
    saveMyFunction
}

export default connect(mapStateToProps, mapDispatchFunction)(CreateFunction);
