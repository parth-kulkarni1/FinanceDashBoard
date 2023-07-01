import React, {useState, useContext} from "react"

import './Home.css'
import { userContext } from "Components/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "Components/Axios/AxiosCommands";

import { Button, Form } from "react-bootstrap";

function Home(){

    const [token, setToken] = useState<string>('');
    const [errors, setErrors] = useState<string | null>(null);
    const {setUser} = useContext(userContext)
    
    const navigate = useNavigate();


    function handleTokenInput(event: React.ChangeEvent<HTMLInputElement>){

        setToken(event.currentTarget.value)

    }

    async function handleLogin(event: React.MouseEvent<HTMLButtonElement>){

        if(token.length === 0){
            setErrors('Token not provided')
            return
        }

        const jwtToken = await verifyToken(token);

        if(jwtToken){

            setUser(true)

            localStorage.setItem('token', jwtToken)

            navigate('/dashboard')

        }

        else{
            setErrors('Incorrect token provided')
        }


    }

    return(

        <div className="d-flex align-items-center login-page-container p-5">

            <div className="flex-custom align-items-center justify-content-center  p-5">

                <div className="d-flex flex-column flex-gap-20">

                    <div>
                        <h3>Login using Up Token</h3>
                    </div>

                    <small>This is experimental app. Things may not be perfect.

                           Your token will not be stored in any shape or form.

                           A session is created and persisted through express session which creates cookies on your side.

                    </small>

                <div>
                    <Form className="login-input" noValidate >
                        <Form.Group>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter Up Token Here"
                                onChange={handleTokenInput}
                                isInvalid = {!!errors}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </div>

                <div>
                    <Button onClick={handleLogin}>Login</Button>
                </div>


                </div>



                </div>
            </div>



    )


}

export default Home;