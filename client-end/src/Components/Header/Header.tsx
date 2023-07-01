import {Navbar, Container, Nav} from "react-bootstrap";
import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";

import { userContext } from "Components/Context/UserContext";




function Header(){

    const {user, setUser} = useContext(userContext)

    const navigate = useNavigate()

    async function handleLogout(){

        localStorage.removeItem('token');
        
        setUser(null)

        navigate('/')
        
    }

    return(
        <Navbar bg = "dark" variant="dark" expand = "lg" >
            <Container >
                <Navbar.Brand> ⚡️Welcome To Your Dashboard</Navbar.Brand>
                <Nav>
                    {!user ?

                    <div className="d-flex">
                        <Nav.Link onClick={() => navigate('/about')}> About</Nav.Link>
                        <Nav.Link onClick={() => navigate('/')}> Login</Nav.Link>
                    </div>
                    :

                    <div className="d-flex">  
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        <Nav.Link onClick={() => navigate('/dashboard')}>Return back To Dashboard</Nav.Link>
                    </div>


                    }


                </Nav>

            </Container>

        </Navbar>
    )

}


export default Header;