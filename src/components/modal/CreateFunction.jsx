import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import classNames from 'classnames';
import { saveInMyFunctions } from '../../api/matefun';
import * as iconType from '../../constants/icons';
import Base from '../pipes/function-parts/Base';
import FunctionIcon from '../pipes/function-parts/FunctionIcon';
import './CreateFunction.scss';

const ICONS = [
    iconType.HELICOPTER,
    iconType.CAR,
    iconType.DRON,
    iconType.START,
    iconType.WINDMILL_TOWER,
    iconType.WORK_HAT,
    iconType.STUDENT_HAT,
    iconType.TSHIRT,
    iconType.SCHOOL,
    iconType.RULE,
    iconType.DEER,
    iconType.SNOWMAN,
    iconType.ROCKET,
    iconType.POLICE_HAT,
    iconType.PLANE,
];

const ButtonIcon = ({icon, onClick, selected }) => {
    return (
        <div className={classNames('ButtonIcon', {'selected':selected })}>
            <svg viewBox="0 0 40 40" onClick={() => onClick & onClick(icon)}>
                <Base/>
                <FunctionIcon icon={icon} />
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
            this.setState({ open: this.props.show })
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
                        <span>Nomber:</span>
                        <input tyep='text' maxLength={10} value={name} onChange={this.onChangeName}/>
                    </div>
                    <div>
                        <p>Selecionear Icono</p>
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
