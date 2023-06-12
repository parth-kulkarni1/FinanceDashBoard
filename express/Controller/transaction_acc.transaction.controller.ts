
// Returns all the transactions associated with the transactional account.

import { Request, Response, NextFunction } from "express";
import {up,TRANSACTIONAL_ID} from '../config'
import { isUpApiError } from "up-bank-api";


export async function getTransactionsHandler(req:Request, res:Response, next:NextFunction){
    try{

        const transactions = await up.transactions.listByAccount(TRANSACTIONAL_ID);
        
        res.json(transactions)
  
    }
  
    catch(e){
  
        if (isUpApiError(e)) {
          // Handle error returned from Up API
          console.log(e.response.data.errors);
        }
  
        // Unexpected error
        throw e;
  
    }
  
}