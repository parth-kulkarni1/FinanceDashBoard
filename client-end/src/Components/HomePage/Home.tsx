import React, {useState, useContext} from "react"

import { useNavigate } from "react-router-dom";

import { Button, Form } from "react-bootstrap";

import { verifyToken } from "Components/Axios/AxiosCommands";

import { UpContext } from "Components/Context/UpContext";

import './Home.css'

function Home(){

    const [token, setToken] = useState<string>('');
    const [errors, setErrors] = useState<string | null>(null);
    const {state, dispatch} = useContext(UpContext)
    
    const navigate = useNavigate();


    function handleTokenInput(event: React.ChangeEvent<HTMLInputElement>){

        setToken(event.currentTarget.value)

    }

    async function handleLogin(event: React.MouseEvent<HTMLButtonElement>){

        if(token.length === 0){
            setErrors('Token not provided')
            return
        }

        const res = await verifyToken(token);

        if(res){

            dispatch({type:'login', payload: true})

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