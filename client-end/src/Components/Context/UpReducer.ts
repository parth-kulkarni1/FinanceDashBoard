import { AccountResource, ListTransactionsResponse, TransactionResource } from "up-bank-api";
import { CurrentState, CurrentAction, TransactionInsightType } from "./UpContext";

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

        case 'transactionInsight':
            const transactionInsightPayload = action.payload as TransactionInsightType

            return {...state, transactionInsight: transactionInsightPayload}

        case 'login':
            return {...state, loggedIn: action.payload as boolean}

        default:
            return state;
    }
}