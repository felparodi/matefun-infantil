import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { openConfig } from '../api/config';
import { logout } from '../api/user';
import { openImportModal, openExportModal } from '../api/matefun';
import Icon from './icons/Icon';
import * as icon from '../constants/icons';
import Configuration from './modal/Configuration';
import Import from './modal/Import';
import Export from './modal/Export';

import './Header.scss';

export class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            importModal: false,
            exportModal: false
        }
    }

    render() {
        const {importModal, exportModal} = this.state
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
                            <Dropdown.Item onClick={this.props.openExportModal}><Icon icon={icon.EXPORT}/>Exportar funciones</Dropdown.Item>
                            <Dropdown.Item onClick={this.props.openImportModal}><Icon icon={icon.IMPORT}/>Importar funciones</Dropdown.Item>
                            <Dropdown.Item onClick={this.props.openConfig}><Icon icon={icon.CONFIG}/>Configuración</Dropdown.Item>
                            <Dropdown.Item onClick={this.props.logout}><Icon icon={icon.LOGOUT}/>Cerrar sesión</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
                <Configuration/>
                <Import/>
                <Export/>
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
    openConfig,
    openImportModal,
    openExportModal
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
