import React from 'react';
import { Container, Row, Button, Card, Form } from 'react-bootstrap';
import { connect } from 'react-redux'

import * as services from '../services';
import { login } from '../redux/user/userAction'

export class Login extends React.Component {

    constructor() {
        super();

        this.loginInvitado = this.loginInvitado.bind(this);
    }

    loginInvitado() {
        services.loginInvitado((userData) => {
            this.props.login(userData);
        })
    }

    render() {
        return (
            <div>
                <Container>
                    <Card style={{ maxWidth: '600px', backgroundColor: "#007bff", marginTop: "80px", marginLeft: "auto", marginRight: "auto" }}>
                        <Card.Body>
                            <h2 className="text-center" style={{ color: "white", margin: "40px" }}>MateFun Infantil</h2>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label style={{ color: "white" }}>Usuario</Form.Label>
                                    <Form.Control type="email" placeholder="Ingrese usuario" />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label style={{ color: "white" }}>Contraseña</Form.Label>
                                    <Form.Control type="password" placeholder="Ingrese contraseña" />
                                </Form.Group>

                                <Row>
                                    <div style={{ margin: "0 auto", marginTop: "30px", marginBottom: "30px" }}>
                                        <Button variant="primary" size="lg" type="button" style={{ borderColor: "white" }}>
                                            Iniciar sesión
                                        </Button>
                                        <Button variant="primary" size="lg" type="button" style={{ borderColor: "white", marginLeft: "30px" }}
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

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        login: userData => dispatch(login(userData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

