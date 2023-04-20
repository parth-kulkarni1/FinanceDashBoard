import {Navigate } from "react-router-dom";
import {useEffect, useState} from "react"
import { findCookie } from "Components/Axios/AxiosCommands";

function PrivateRoutes({children}){

    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        async function fetchCookie(){
            const res = await findCookie();
            setLoggedIn(res);
        }

        fetchCookie();
    }, [])

    if(loggedIn === false){
        return (
            <Navigate to='/'></Navigate>
        )
    }

    else{
        return children
    }

}

export default PrivateRoutes;
