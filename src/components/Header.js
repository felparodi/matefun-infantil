import React from 'react';
import { Navbar, Nav, Button, Form, FormControl } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar bg="primary" variant="dark" style={{ marginBottom: '15px' }}>
            <Navbar.Brand href="#home">Matefun Infantil</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-light">Search</Button>
            </Form>
        </Navbar>
    );
}

export default Header;