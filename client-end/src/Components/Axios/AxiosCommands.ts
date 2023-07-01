import axios, {AxiosResponse } from 'axios'
import {AccountResource, ListTransactionsResponse} from 'up-bank-api'
import {MonthlyCategoryDetailed, categoryList, merchantResponse, pastTransactionsHistory, postObj } from './TypesAxios';


/* This contains all axios commands made to the backend */


export async function verifyToken(token: string){
    const {data} = await axios.get<string | null>(`/api/login/${token}`)

    return data

}

export async function checkTokenValidity() {
  const { data } = await axios.get<any>('/api/checkTokenValidity', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function logout() {
  const { data } = await axios.post<any>('/api/logout', null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getTransactionalAccount() {
  const { data } = await axios.get<AccountResource>('/api/accounts/transactional', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getSavingsAccount() {
  const { data } = await axios.get<AccountResource>('/api/accounts/savings', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getSavingBalance() {
  const { data } = await axios.get<AccountResource>('/api/accounts/savings', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data.attributes.balance.value
}

export async function getTransactions() {
  const { data } = await axios.get<ListTransactionsResponse>('/api/accounts/transactional/transactions', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getMonthlyTransactionalTotal() {
  const { data } = await axios.get<string>('/api/accounts/trasactional/monthly', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getNextTransaction(api_link: string) {
  const { data } = await axios.get<ListTransactionsResponse>('/api/transactions/next', {
    params: {
      link: api_link,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getTransactionInformation(description: string) {
  const { data } = await axios.get<merchantResponse>(`/api/transactional/${description}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getPreviousTransactions(obj: any) {
  const { data } = await axios.post<pastTransactionsHistory>(`/api/transactional/category`, obj, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getMonthlySummary(requestedMonth: string) {
  const { data } = await axios.get<any>(`/api/transactional/monthly/graph/${requestedMonth}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getMonthlyCategorySummary(requestedMonth: string) {
  const { data } = await axios.get<any>(`/api/transactions/monthly/categories/${requestedMonth}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getMonthlyPopularCompanies(requestedMonth: string) {
  const { data } = await axios.get<any>(`/api/transactional/monthly/top10/${requestedMonth}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function getMonthlyCategoryDetailed(requestedMonth: string) {
  const { data } = await axios.get<MonthlyCategoryDetailed[]>(`/api/transactional/monthly/category/detailed/${requestedMonth}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function addTagsToTransaction(postObj: postObj) {
  const response = await axios.post<AxiosResponse>('/api/transactions/add/tag', postObj, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response
}

export async function removeTagsToTransaction(postObj: postObj) {
  const response = await axios.delete<AxiosResponse>('/api/transactions/delete/tag', {
    data: postObj,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  return response
}

export async function getCategories() {
  const { data } = await axios.get<categoryList[]>('/api/categories', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data
}

export async function categoriseTransaction(postObj: any) {
  const response = await axios.patch<AxiosResponse>('/api/categories/change', postObj, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response
}







