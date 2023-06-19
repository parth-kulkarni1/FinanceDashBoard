// This function calls the next of paginated data, and returns it back to front end

import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { TOKEN } from '../config';
import { ListTransactionsResponse, isUpApiError } from "up-bank-api";
import { errorType } from "../Types/Axios/controllersTypes";

export async function getNextPaginatedDataHandler(req: Request, res: Response<ListTransactionsResponse| errorType>, next: NextFunction) {
  try {
    const nextLink = req.query.link as string;

    // Make a GET request to the next link of paginated data
    const { data } = await axios.get<ListTransactionsResponse>(nextLink, { headers: { "Authorization": `Bearer ${TOKEN}` } });

    res.json(data);
  } catch (e) {
    if (isUpApiError(e)) {
      // Handle error returned from Up API
      console.log(e.response.data.errors);
      res.status(500).json({ error: "An error occurred while retrieving the next paginated data." });
    } else {
      // Unexpected error
      console.log(e);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
}
