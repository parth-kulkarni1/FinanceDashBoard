import {Navbar, Container, Nav, Button} from "react-bootstrap";
import React, {useEffect, useState} from "react";


function Header(){

    return(
        <Navbar bg = "dark" variant="dark" expand = "lg" >
            <Container >
                <Navbar.Brand> ⚡️Welcome To Your Dashboard</Navbar.Brand>
                <Nav className="flex-gap-20">
                    <Nav.Link> About</Nav.Link>
                    <Nav.Link> Login</Nav.Link>
                </Nav>

            </Container>

        </Navbar>
    )

}


export default Header;