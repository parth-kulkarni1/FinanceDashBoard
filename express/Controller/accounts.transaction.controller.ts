import { Request, Response, NextFunction } from "express";
import {up,TRANSACTIONAL_ID,setTransactionalId} from '../config'
import { AccountResource, isUpApiError } from "up-bank-api";

export async function getTransactionalAccountHandler(req: Request, res: Response<AccountResource>, next: NextFunction){

    try {

        if(req.session.myData){
          const accounts = await up.accounts.list()
          const transactionAccountID = accounts.data.find(val => val.attributes.accountType == "TRANSACTIONAL")?.id as string

          setTransactionalId(transactionAccountID)

          const tranactionalAccount = await up.accounts.retrieve(TRANSACTIONAL_ID as string)
  
          res.json(tranactionalAccount.data)
  
        }
  
        else{
          return res.redirect('/')
        }
  
  
        } catch (e) {
          if (isUpApiError(e)) {
            // Handle error returned from Up API
            console.log(e.response.data.errors);
          }
      
          // Unexpected error
          throw e;
        }
      
}
