import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PrivateRoutes({ children }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    setLoggedIn(isAuthenticated);
  }, []);

  if (!loggedIn) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default PrivateRoutes;
