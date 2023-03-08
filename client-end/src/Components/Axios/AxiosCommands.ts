import axios from 'axios'
import { ListAccountResponse, PaginationLinks, AccountResource, MoneyObject} from 'up-bank-api'

/* This contains all axios commands made to the backend */

export async function getAllAccounts(){
    
    const {data} = await axios.get<ListAccountResponse>('/accounts')


    return data;
}

export async function getSavingBalance(){
    const {data} = await axios.get<MoneyObject>('/accounts/savings')

    return data.value;


}





