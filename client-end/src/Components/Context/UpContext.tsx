// This is essentially creating a global state with useReducer
// Easier to do than keep managing props, and for scalibility

import React, {createContext, ReactNode, useReducer} from "react";
import { AccountResource, ListTransactionsResponse } from "up-bank-api";
import { UpReducer } from "./UpReducer";



export interface CurrentState{
    savingsAccount: AccountResource | null,
    trasactionalAccount: AccountResource | null,
    transactionsList: ListTransactionsResponse | null
}

const initalState: CurrentState = {    
    savingsAccount: null,
    trasactionalAccount: null, 
    transactionsList: null
}


export type CurrentAction = {
    type: 'hey'
    payload: string
            
}


type UpProviderProps = {
    children: ReactNode
}


export const UpContext = createContext<{state: CurrentState, dispatch: React.Dispatch<CurrentAction>}>({
    state: initalState, 
    dispatch: () => {},
})


export const UpContextProvider = ({children} : UpProviderProps) => {
    const [state, dispatch] = useReducer(UpReducer, initalState);

    return(
        <UpContext.Provider value={{state, dispatch}}>
            {children}
        </UpContext.Provider>

    )


}
