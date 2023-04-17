import {Navbar, Container, Nav, Button} from "react-bootstrap";
import React, {useEffect, useState, useContext} from "react";

import { UpContext } from "Components/Context/UpContext";


function Header(){

    const {state} = useContext(UpContext)

    return(
        <Navbar bg = "dark" variant="dark" expand = "lg" >
            <Container >
                <Navbar.Brand> ⚡️Welcome To Your Dashboard</Navbar.Brand>
                <Nav>
                    {!state.loggedIn ?

                    <div className="d-flex">
                        <Nav.Link> About</Nav.Link>
                        <Nav.Link> Login</Nav.Link>
                    </div>
                    :

                    <Nav.Link>Logout</Nav.Link>

                    }


                </Nav>

            </Container>

        </Navbar>
    )

}


export default Header;