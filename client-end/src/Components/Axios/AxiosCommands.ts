import axios from 'axios'
import {AccountResource, ListTransactionsResponse} from 'up-bank-api'

/* This contains all axios commands made to the backend */

export async function getTransactionalAccount(){
    
    const {data} = await axios.get<AccountResource>('/accounts/transactional')


    return data;
}


export async function getSavingsAccount(){
    
    const {data} = await axios.get<AccountResource>('/accounts/savings')


    return data;
}


export async function getSavingBalance(){
    const {data} = await axios.get<AccountResource>('/accounts/savings')


    return data.attributes.balance.value;

}


export async function getTransactions(){
    const {data} = await axios.get<ListTransactionsResponse>('/accounts/transactional/transactions')

    console.log("transcations", data)

    return data;


}






