// This controller calculates the average and total spend across the respective transaction merchant

import { Request, Response, NextFunction } from "express";
import { up } from "../config";
import { userMerchantSummary, transactionSummaryResponse, errorType } from "../Types/Axios/controllersTypes";

export async function getTransactionSummaryHandler (req:Request<{}, {}, {categoryName: string, merchantName: string}>
                                                    ,res:Response<transactionSummaryResponse | errorType>, next:NextFunction){
    
  try{

    const categoryDescription = req.body.categoryName
    const merchantName = req.body.merchantName

    const transactionsCategorised = await up.transactions.list({filterCategory: categoryDescription})

    const updated = transactionsCategorised.data.filter((val) => val.attributes.description === merchantName)

    // Now lets do some maths on the calculations..

    const numberOfTransactions = updated.length;
    let sumOfTransactions = 0;

    for(let i = 0; i < updated.length; i ++){


      sumOfTransactions += (Math.abs(parseFloat(updated[i].attributes.amount.value)))

    }

    const average = (sumOfTransactions / numberOfTransactions)

    const userMerchantSummary: userMerchantSummary = {numberOfTransactions: numberOfTransactions, 
                                                      sumOfTransactions: sumOfTransactions,
                                                      averageOfTransactions: average}

    res.json({transactionSummary: userMerchantSummary, pastTransactionsList: updated})

  } catch(e){
    res.json({error: "Something has gone wrong here.."})
  }
}