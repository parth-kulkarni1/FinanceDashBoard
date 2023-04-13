import axios from 'axios'
import {AccountResource, ListTransactionsResponse} from 'up-bank-api'
import {merchantResponse } from './TypesAxios';

/* This contains all axios commands made to the backend */

export async function getTransactionalAccount(){
    
    const {data} = await axios.get<AccountResource>('/accounts/transactional')

    console.log("transcations", data)

    return data;
}


export async function getSavingsAccount(){
    
    const {data} = await axios.get<AccountResource>('/accounts/savings')

    console.log("transcations", data)

    return data;
}


export async function getSavingBalance(){
    const {data} = await axios.get<AccountResource>('/accounts/savings')

    console.log("transcations", data)

    return data.attributes.balance.value;

}


export async function getTransactions(){
    const {data} = await axios.get<ListTransactionsResponse>('/accounts/transactional/transactions')

    console.log("transcations", data)

    return data;


}


export async function getMonthlyTransactionalTotal(){
    const {data} = await axios.get<string>('/accounts/trasactional/monthly')
    console.log("transcations", data)

    return data

}

export async function getNextTransaction(api_link: string){
    const {data} = await axios.get<ListTransactionsResponse>('/transactions/next', {
        params: {
            link: api_link
        }
    })

    console.log(data, "axios response")

    return data

}

export async function getTransactionInformation(description: string){
    const {data} = await axios.get<merchantResponse>(`/transactional/${description}`)

    console.log(data, "indiviudal transact")

    return data;


}






