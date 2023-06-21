import axios, {AxiosResponse } from 'axios'
import {AccountResource, ListTransactionsResponse} from 'up-bank-api'
import {MonthlyCategoryDetailed, categoryList, cookieSessionExpiryRoute, merchantResponse, pastTransactionsHistory, postObj } from './TypesAxios';


/* This contains all axios commands made to the backend */


export async function findCookie(){
    const {data} = await axios.get<boolean>('/api/cookie')

    return data
}

export async function checkSessionExpiration(){
    const {data} = await axios.get<cookieSessionExpiryRoute>('/api/check-session')

    return data
}

export async function verifyToken(token: string){

    const {data} = await axios.get<any>(`/api/login/${token}`)

    return data

}

export async function logout(){
    const {data} = await axios.post<any>('/api/logout')

    return data;

}


export async function getTransactionalAccount(){
    
    const {data} = await axios.get<AccountResource>('/api/accounts/transactional')

    return data;
}


export async function getSavingsAccount(){
    
    const {data} = await axios.get<AccountResource>('/api/accounts/savings')

    return data;
}

export async function getSavingBalance(){
    const {data} = await axios.get<AccountResource>('/api/accounts/savings')

    return data.attributes.balance.value;

}


export async function getTransactions(){
    const {data} = await axios.get<ListTransactionsResponse>('/api/accounts/transactional/transactions')

    return data;


}


export async function getMonthlyTransactionalTotal(){
    const {data} = await axios.get<string>('/api/accounts/trasactional/monthly')
    
    return data

}

export async function getNextTransaction(api_link: string){
    const {data} = await axios.get<ListTransactionsResponse>('/api/transactions/next', {
        params: {
            link: api_link
        }
    })

    return data

}

export async function getTransactionInformation(description: string){
    const {data} = await axios.get<merchantResponse>(`/api/transactional/${description}`)

    return data;

}

export async function getPreviousTransactions(obj: any){
    const {data} = await axios.post<pastTransactionsHistory>(`/api/transactional/category`, obj)

    return data;

}


export async function getMonthlySummary(requestedMonth: string){
    const {data} = await axios.get<any>(`/api/transactional/monthly/graph/${requestedMonth}`)

    return data;

}

export async function getMonthlyCategorySummary(requestedMonth: string){
    const {data} = await axios.get<any>(`/api/transactions/monthly/categories/${requestedMonth}`)

    return data;
}


export async function getMonthlyPopularCompanies(requestedMonth: string){
    const {data} = await axios.get<any>(`/api/transactional/monthly/top10/${requestedMonth}`)

    return data;

}

export async function getMonthlyCategoryDetailed(requestedMonth: string){
    const {data} = await axios.get<MonthlyCategoryDetailed[]>(`/api/transactional/monthly/category/detailed/${requestedMonth}`)

    return data

}

export async function addTagsToTransaction(postObj: postObj){
    const response = await axios.post<AxiosResponse>('/api/transactions/add/tag', postObj)

    return response

}

export async function removeTagsToTransaction(postObj: postObj){
    const response = await axios.delete<AxiosResponse>('/api/transactions/delete/tag', {
        data: postObj,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return response

}

export async function getCategories(){
    const {data} = await axios.get<categoryList[]>('/api/categories')

    return data
}

export async function categoriseTransaction(postObj: any){
    const response = await axios.patch<AxiosResponse>('/api/categories/change', postObj)

    return response


}






