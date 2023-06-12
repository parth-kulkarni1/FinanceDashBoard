import axios, { AxiosResponse } from "axios";
import { Request, Response, NextFunction } from "express";
import { up, TOKEN } from "../config";

export async function changeTransactionCategoryHandler(req: Request<{}, {}, {transactionId: string, category: {type: string, id: string} }>, res: Response, next:NextFunction){
    try{

        const transactionID = req.body.transactionId
        const categoryData = req.body.category
    
        const headers = {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type'  : 'application/json'
        };
    
        const data = {
          data:{
            type: categoryData.type, 
            id: categoryData.id
          }
        }
    
        const response = await axios.patch<AxiosResponse>(`https://api.up.com.au/api/v1/transactions/${transactionID}/relationships/category`, data, {headers})
    
        if(response.status === 204){
            res.sendStatus(204)
        }
    
        else{
          res.sendStatus(500)
        }
    
    
      } catch(err){
        res.sendStatus(500).json({error: "An error has occurred."})
      }
    
}