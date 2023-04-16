import React, {useState} from "react"

import {Navbar, Container, Nav, Button} from "react-bootstrap"

function Footer(){

    return(
        <div>
            <Navbar bg="dark" variant="dark" fixed="bottom">
                <Container className="d-flex justify-content-around">
                    <Nav className="flex-gap-20">
                        <Nav.Link>© Up Bank Api 2023</Nav.Link>
                        <Nav.Link>About</Nav.Link>
                    </Nav>
                </Container>

            </Navbar>
        </div>
    )

}

export default Footer;