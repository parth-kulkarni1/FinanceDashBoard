import {Navbar, Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";

import { getSavingBalance } from "Components/Axios/AxiosCommands";


function Header(){

    const [balance, setBalance] = useState<string | null>(null)

    useEffect(() => {

        async function getSavingAccountValue(){

            await getSavingBalance().then(balance => setBalance(balance));

        }

        getSavingAccountValue();

    }, [])

    return(
        <Navbar bg = "light" expand = "lg">
            <Container>
                <Navbar.Brand>Welcome To Your Dashboard</Navbar.Brand>
                <Navbar.Brand>Current Saving's Balance: ${balance ? balance : 0} </Navbar.Brand>
            </Container>

        </Navbar>
    )

}


export default Header;