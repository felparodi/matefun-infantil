import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { openConfig } from '../api/config';
import { logout } from '../api/user';
import Icon from '../components/Icon';
import * as icon from '../constants/icons';

export class Header extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Navbar variant="dark" style={{ marginBottom: '15px', backgroundColor:'#004BA8'}}>
                <Navbar.Brand>Matefun Infantil</Navbar.Brand>
                <Nav className="mr-auto"></Nav>

                <Dropdown alignRight>
                    <Dropdown.Toggle style={{backgroundColor:'transparent',borderStyle:'none'}}>
                        <Icon icon={icon.USER}/> {(this.props.userData) ? this.props.userData.nombre + " " + this.props.userData.apellido : ""}
                    </Dropdown.Toggle> 
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.props.openConfig}>Configuracion</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.logout}>Cerrar sesión</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </Navbar>
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
