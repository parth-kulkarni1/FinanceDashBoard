// This function calls the next of paginated data, and returns it back to front end

import { Request, Response, NextFunction } from "express";
import axios from "axios";
import {TOKEN} from '../config'
import { ListTransactionsResponse, isUpApiError } from "up-bank-api";

export async function getNextPaginatedDataHandler(req:Request, res:Response, next:NextFunction){

    try{

        const next = req.query.link as string;
        
        const {data} = await axios.get<ListTransactionsResponse>(next, { headers: {"Authorization" : `Bearer ${TOKEN}`} })
    
        res.json(data)
        
    
      } catch(e){
        if (isUpApiError(e)) {
          console.log(e.response.data.errors)
        }
      }
}