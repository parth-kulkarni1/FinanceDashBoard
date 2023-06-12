// This controller deletes a tag given to a respective transaction 

import { Request, Response, NextFunction } from "express";
import { up } from "../config";

export async function deleteTagToTransactionHandler(req: Request, res: Response, next: NextFunction){

  try{
    const tabObj = req.body

    await up.tags.removeTagsFromTransaction(tabObj.transactionId,[tabObj.tags])

    res.sendStatus(204) // Sending 204 status code for success

 } catch (err){
   res.sendStatus(500).json({error: 'An error occurred'})
 }


}