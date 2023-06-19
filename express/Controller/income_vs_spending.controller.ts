// This controller calculates the earning vs spending for the respective month 

import { Request, Response, NextFunction } from "express";
import { up } from "../config";

import moment from "moment";
import { isUpApiError } from "up-bank-api";

export async function getIncomeVsSpendingHandler(req:Request, res:Response, next: NextFunction){
    
  try{

    const requestedMonthStart = moment(req.params.id, 'MMMM YYYY').toISOString()

    const requestedMonthEnd = moment(requestedMonthStart).endOf('month').toISOString()

    const data = await up.transactions.list({filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100})

    // Need to fetch all data here.. 

    


    let income = 0; 
    let spending = 0;

    for(let i = 0; i < data.data.length; i++){

      let value = parseFloat(data.data[i].attributes.amount.value);

      const validExpense = data.data[i].attributes.isCategorizable && data.data[i].attributes.amount.valueInBaseUnits < 0

      const validIncome = data.data[i].attributes.isCategorizable && data.data[i].attributes.amount.valueInBaseUnits > 0

      if(validIncome){ // This means that its some form of income

        income = income + value;

      }

      else if (validExpense){
        spending = spending + Math.abs(value);
      }

    }

    res.json([{status:"income", income: income}, {status:"spending", spending: spending}]);

  }

  catch(err){
    if(isUpApiError(err)){
      res.json(err)
      return
    }

    res.json(err)


  }

}