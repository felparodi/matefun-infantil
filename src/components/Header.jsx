import React from 'react';
import { Navbar, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux'

import { logout2 } from '../api/user'


export class Header extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Navbar bg="primary" variant="dark" style={{ marginBottom: '15px' }}>
                <Navbar.Brand >Matefun Infantil</Navbar.Brand>
                <Nav className="mr-auto"></Nav>

                <DropdownButton alignRight id="dropdown-basic-button" title={(this.props.userData) ? this.props.userData.nombre + " " + this.props.userData.apellido : ""}>
                    <Dropdown.Item onClick={this.props.logout2}>Cerrar sesión</Dropdown.Item>
                </DropdownButton>

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
    logout2
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
