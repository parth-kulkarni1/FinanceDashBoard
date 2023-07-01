import React, { createContext, useState, useEffect } from "react";
import { checkTokenValidity } from "Components/Axios/AxiosCommands";

type userContextType = {
  user: boolean | null;
  setUser: React.Dispatch<React.SetStateAction<boolean | null>>;
};

type userContextProviderProps = {
  children: React.ReactNode;
};

export const userContext = createContext({} as userContextType);

export const UserContextProvider = ({ children }: userContextProviderProps) => {
  const [user, setUser] = useState<boolean | null>(null);

  useEffect(() => {
    const checkTokenAuthentication = async () => {
      try {
        const storedToken = localStorage.getItem("token"); // Retrieves the token from localStorage
        if (storedToken) {
          setUser(true);
        } else {
          const response = await checkTokenValidity(); // Make an API request to your backend to check token validity

          if(response !== true){
            setUser(false)
          }

          else{
            setUser(true)
          }
        }
      } catch (error) {
        // Handle error if necessary
      }
    };

    checkTokenAuthentication();
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};
