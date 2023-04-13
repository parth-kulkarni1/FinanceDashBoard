import { AccountResource, ListTransactionsResponse, TransactionResource } from "up-bank-api";
import { CurrentState, CurrentAction } from "./UpContext";

export function UpReducer(state: CurrentState, action: CurrentAction): CurrentState{
    switch(action.type){

        case 'savingAccountBalance':
            const savingsAccountPayload = action.payload as AccountResource

            return {...state, savingsAccountBalance: savingsAccountPayload}
        
        case 'transactionalAccountBalance':
            const transactionalAccountPayload = action.payload as AccountResource

            return {...state, trasactionalAccountBalance: transactionalAccountPayload}

        case 'getTransactions':
            const transactionsPayload = action.payload as ListTransactionsResponse

            return {...state, transactionsList:transactionsPayload}

        case 'getMonthlySpending':
            const totalMonthlySpendingPayload = action.payload as string

            return {...state, monthlySpendingTotal: totalMonthlySpendingPayload}

        case 'transactionIndividual':
            const transactionIndividualPayload = action.payload as TransactionResource

            return {...state, transactionIndividual: transactionIndividualPayload}

        default:
            return state;
    }
}