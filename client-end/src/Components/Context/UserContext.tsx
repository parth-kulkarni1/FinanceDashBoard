import { findCookie } from "Components/Axios/AxiosCommands";
import React, {createContext, useState, useEffect } from "react";


type userContextType = {
    user: boolean | null, 
    setUser: React.Dispatch<React.SetStateAction<boolean | null >>
}

type userContextProviderProps = {
    children: React.ReactNode
}

export const userContext = createContext({} as userContextType)


export const UserContextProvider = ({children}: userContextProviderProps) =>{

    const [user,setUser] = useState<boolean | null>(null); // Null as the user is logged in but this value can change

    useEffect(() =>{

        async function InitaliseCookie(){

            console.log("triggering again and again..")
    
            const userData: boolean = await findCookie(); // find the cookie and see if it's present
    
    
            if (userData){
                setUser(true)
            
            }
    
            else{
                setUser(false)
            }
    
            }
    
    
            InitaliseCookie();
    

    }, [])


    return (
        <userContext.Provider value = {{user, setUser}}>
            {children}
        </userContext.Provider>

    )


} 