
// This controller returns the total amount of spending within the month

import { Request, Response, NextFunction } from "express";
import {up,TRANSACTIONAL_ID} from '../config'
import { isUpApiError } from "up-bank-api";

import moment from "moment";

export async function getMonthlyTotalSpendingHandler(req: Request, res: Response, next: NextFunction){
    
  try{

    const startOfMonth = moment().startOf('month').toISOString()

    const transactions = await up.transactions.listByAccount(TRANSACTIONAL_ID, {filterSince: startOfMonth });
    
    let total: number = 0;

    // Calculate the monthly cost 

    for(let i = 0; i < transactions.data.length; i++){

      if(transactions.data[i].attributes.amount.valueInBaseUnits < 0 && transactions.data[i].attributes.isCategorizable === true){

          total = total + Math.abs(parseFloat(transactions.data[i].attributes.amount.value))

      }

    }

    res.json(total.toFixed(2))


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