import { Request, Response, NextFunction } from "express";
import { up, TRANSACTIONAL_ID } from '../config';
import { isUpApiError } from "up-bank-api";
import moment from "moment";
import { errorType } from "../Types/Axios/controllersTypes";

export async function getMonthlyTotalSpendingHandler(req: Request, res: Response<string | errorType>, next: NextFunction) {

  try {
    const startOfMonth = moment().startOf('month').toISOString();

    // Retrieve transactions for the current month
    const transactions = await up.transactions.listByAccount(TRANSACTIONAL_ID, { filterSince: startOfMonth });

    let total: number = 0;

    // Calculate the monthly spending
    for (let i = 0; i < transactions.data.length; i++) {
      if (transactions.data[i].attributes.amount.valueInBaseUnits < 0 && transactions.data[i].attributes.isCategorizable === true) {
        total += Math.abs(parseFloat(transactions.data[i].attributes.amount.value));
      }
    }

    res.json(total.toFixed(2));
  } catch (e) {
    if (isUpApiError(e)) {
      // Handle error returned from Up API
      console.log(e.response.data.errors);
      res.status(500).json({ error: "An error occurred while retrieving the monthly total spending." });
    } else {
      // Unexpected error
      console.log(e);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
}
