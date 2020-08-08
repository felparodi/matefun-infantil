import React from 'react';
import { Container, Row, Button, Card, Form } from 'react-bootstrap';
import { connect } from 'react-redux'

import { login } from '../api/user'
import './Login.scss';

export class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
        }
        this.loginInvitado = this.loginInvitado.bind(this);
        this.login = this.login.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    }

    loginInvitado() {
        this.props.login("invitado", "invitado");
    }

    login() {
        const { username, password } = this.state;
        this.props.login(username, password);
    }

    render() {
        const { username, password } = this.state;
        return (
            <div className="Login">
                <Container>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center">MateFun Infantil</h2>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label className="label">Usuario</Form.Label>
                                    <Form.Control 
                                        onChange={(e) => this.setState({username: e.target.value})} 
                                        value={username} type="email" 
                                        onKeyDown={this.handleKeyDown}
                                        placeholder="Ingrese usuario" />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label className="label">Contraseña</Form.Label>
                                    <Form.Control onChange={(e) => this.setState({password: e.target.value})} 
                                        value={password}
                                        onKeyDown={this.handleKeyDown}
                                        type="password" 
                                        placeholder="Ingrese contraseña" />
                                </Form.Group>

                                <Row>
                                    <div className="buttons">
                                        <Button variant="primary" size="lg" type="button" 
                                            onClick={this.login}>
                                            Iniciar sesión
                                        </Button>
                                        <Button variant="primary" size="lg" type="button"
                                            onClick={this.loginInvitado}>
                                            Invitado
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }
}

const mapDispatchToProps = {
    login
}

export default connect(null, mapDispatchToProps)(Login);

