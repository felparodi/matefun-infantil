import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import classNames from 'classnames';
import { saveInMyFunctions } from '../../api/matefun';
import * as icons from '../../constants/icons';
import Base from '../pipes/function-parts/Base';
import FunctionDescriptor from '../pipes/function-parts/FunctionDescriptor';
import './CreateFunction.scss';

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
        this.props.saveInMyFunctions(name.trim(), icon);
        this.setState({open: false});
        this.props.onHide();
    }

    render() {
        const { open, name, icon } = this.state;
        const modalProps = {...this.props}
        delete(modalProps.saveInMyFunctions);
        return (
            <Modal 
                {...modalProps}
                show={open}
                className="CreateFunction">
                <Modal.Header>Nueva Funcion</Modal.Header>
                <Modal.Body>
                    <div>
                        <span>Nombre:</span>
                        <input tyep='text' maxLength={10} value={name} onChange={this.onChangeName}/>
                    </div>
                    <div>
                        <p>Seleccionar Icono</p>
                        <div className="icons">
                            { ICONS.map((iconName) => <ButtonIcon 
                                                        key={iconName} 
                                                        onClick={() => this.setState({icon: iconName != icon ? iconName : ''})}
                                                        icon={iconName} 
                                                        selected={iconName === icon}/>)}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button disabled={!icon && !name} onClick={this.saveFunction}>Salvar</button>
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
