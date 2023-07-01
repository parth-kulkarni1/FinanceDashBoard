import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PrivateRoutes({ children }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token !== null){

      console.log("set tp true")


      setLoggedIn(true)
    }

    else{
      console.log("set to false")
      setLoggedIn(false)
    }
    
  }, []);

  if (loggedIn === false) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default PrivateRoutes;
