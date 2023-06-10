import axios, { AxiosResponse } from 'axios'
import {AccountResource, ListTransactionsResponse} from 'up-bank-api'
import {MonthlyCategoryDetailed, merchantResponse, pastTransactionsHistory, postObj } from './TypesAxios';


/* This contains all axios commands made to the backend */


export async function findCookie(){
    const {data} = await axios.get<any>('/cookie')

    console.log("cookie data", data)

    return data
}

export async function verifyToken(token: string){

    const {data} = await axios.get<any>(`/login/${token}`)

    console.log(data, "login res")

    return data

}

export async function logout(){
    const {data} = await axios.post<any>('/logout')

    return data;

}


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

export async function getPreviousTransactions(obj: any){
    const {data} = await axios.post<pastTransactionsHistory>(`/transactional/category`, obj)

    console.log(data, "previous trasnactions")

    return data;

}


export async function getMonthlySummary(requestedMonth: string){
    const {data} = await axios.get<any>(`/transactional/monthly/graph/${requestedMonth}`)

    console.log(data, "monthly transact");

    return data;

}

export async function getMonthlyCategorySummary(requestedMonth: string){
    const {data} = await axios.get<any>(`/transactions/monthly/categories/${requestedMonth}`)

    console.log(data, "category data")

    return data;
}


export async function getMonthlyPopularCompanies(requestedMonth: string){
    const {data} = await axios.get<any>(`/transactional/monthly/top10/${requestedMonth}`)

    console.log(data, "top 10 places")

    return data;

}

export async function getMonthlyCategoryDetailed(requestedMonth: string){
    const {data} = await axios.get<MonthlyCategoryDetailed[]>(`/transactional/monthly/category/detailed/${requestedMonth}`)

    return data

}

export async function addTagsToTransaction(postObj: postObj){
    const response = await axios.post<AxiosResponse>('/transactions/add/tag', postObj)

    console.log(response, "added tags yee")

    return response

}






