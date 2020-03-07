import React from 'react';
import { Navbar, Nav, Button, Form, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';

export default class Header extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Navbar bg="primary" variant="dark" style={{ marginBottom: '15px' }}>
                <Navbar.Brand >Matefun Infantil</Navbar.Brand>
                <Nav className="mr-auto"></Nav>

                <DropdownButton alignRight id="dropdown-basic-button" title={(this.props.userData)?this.props.userData.nombre + " " + this.props.userData.apellido:""}>
                    <Dropdown.Item onClick={this.props.onLogout}>Cerrar sesión</Dropdown.Item>
                </DropdownButton>

            </Navbar>
        )
    }
}
