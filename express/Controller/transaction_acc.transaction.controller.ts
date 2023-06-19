
// Returns all the transactions associated with the transactional account.
import { Request, Response, NextFunction } from "express";
import { up, TRANSACTIONAL_ID } from '../config';
import { ListTransactionsResponse, isUpApiError } from "up-bank-api";
import { errorType } from "../Types/Axios/controllersTypes";

export async function getTransactionsHandler(req: Request, res: Response<ListTransactionsResponse | errorType>, next: NextFunction) {
  try {
    const transactions = await up.transactions.listByAccount(TRANSACTIONAL_ID);
    res.json(transactions);
  } 
  
  catch (e) {
  
    if (isUpApiError(e)) {
      // Handle error returned from Up API
      console.log(e.response.data.errors);
      res.status(500).json({ error: "An error occurred while retrieving transactions." });
    } 
    
    else {
      // Unexpected error
      console.log(e);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
}
