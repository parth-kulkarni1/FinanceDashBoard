import React, {useState} from "react"

import { Button, Form } from "react-bootstrap";

import './Home.css'

function Home(){

    return(

        <div className="d-flex align-items-center login-page-container p-5">

            <div className="flex-custom align-items-center justify-content-center  p-5">

                <div className="d-flex flex-column flex-gap-20">

                    <div>
                        <h3>Login using Up Token</h3>
                    </div>

                <div>
                    <Form className="login-input" >
                        <Form.Group>
                            <Form.Control type="password" placeholder="Enter Up Token Here"></Form.Control>
                        </Form.Group>
                    </Form>
                </div>

                <div>
                    <Button>Login</Button>
                </div>


                </div>



                </div>
            </div>



    )


}

export default Home;