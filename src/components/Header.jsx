import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { openConfig } from '../api/config';
import { logout } from '../api/user';

import Icon from '../components/Icon';
import * as icon from '../constants/icons';
import Configuration from './modal/Configuration';

import './Header.scss';

export class Header extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <React.Fragment>
                <Navbar variant="dark" className="Header">
                    <Navbar.Brand>MateFun Infantil</Navbar.Brand>
                    <Nav className="mr-auto"></Nav>

                    <Dropdown alignRight>
                        <Dropdown.Toggle style={{backgroundColor:'transparent',borderStyle:'none'}}>
                            <Icon icon={icon.USER}/> {(this.props.userData) ? this.props.userData.nombre + " " + this.props.userData.apellido : ""}
                        </Dropdown.Toggle> 
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.props.openConfig}><Icon icon={icon.CONFIG}/>Configuracion</Dropdown.Item>
                            <Dropdown.Item onClick={this.props.logout}><Icon icon={icon.LOGOUT}/>Cerrar sesión</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
                <Configuration/>
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
}

const mapDispatchToProps = {
    logout,
    openConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
