import React from "react"

import {Navbar, Container, Nav} from "react-bootstrap"
import {useNavigate } from "react-router-dom";

function Footer(){

    const navigate = useNavigate();

    return(
        <div>
            <Navbar bg="dark" variant="dark" fixed="bottom">
                <Container className="d-flex justify-content-around">
                    <Nav className="flex-gap-20">
                    <Nav.Link href="https://developer.up.com.au/" target="_blank">© Up Bank Api 2023</Nav.Link>
                        <Nav.Link onClick={() => navigate('/About')}>About</Nav.Link>
                    </Nav>
                </Container>

            </Navbar>
        </div>
    )

}

export default Footer;