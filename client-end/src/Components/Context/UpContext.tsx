// This is essentially creating a global state with useReducer
// Easier to do than keep managing props, and for scalibility

import React, {createContext, ReactNode, useReducer} from "react";
import { AccountResource, ListTransactionsResponse, TransactionResource } from "up-bank-api";
import { UpReducer } from "./UpReducer";



export interface CurrentState{
    savingsAccountBalance: AccountResource | null,
    trasactionalAccountBalance: AccountResource | null,
    transactionsList: ListTransactionsResponse | null,
    monthlySpendingTotal: string | null, 
    transactionIndividual: TransactionResource | null
}

const initalState: CurrentState = {    
    savingsAccountBalance: null,
    trasactionalAccountBalance: null, 
    transactionsList: null,
    monthlySpendingTotal: null,
    transactionIndividual: null
}



export type CurrentAction = {
    type: 'savingAccountBalance' | 'transactionalAccountBalance'| 'getTransactions' | 'getMonthlySpending' | 'transactionIndividual'
    payload: AccountResource | ListTransactionsResponse | TransactionResource | string | null
            
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
