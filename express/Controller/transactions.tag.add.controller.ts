// This controller handles the adding of tags to a given transaction 

import { Request, Response, NextFunction } from "express";
import { up } from "../config";

export async function addTagsToTransactionHandler(req: Request, res:Response, next: NextFunction){
    
  try{
  
    const tagObj = req.body
    
    await up.tags.addTagsToTransaction(tagObj.transactionId, [tagObj.tags])

    res.sendStatus(204) // Sending 204 status code for success
  
  } catch(err){
    res.status(500).json({ error: 'An error occurred' });
  }
}