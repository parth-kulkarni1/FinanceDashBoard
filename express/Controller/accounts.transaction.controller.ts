import { Request, Response, NextFunction } from "express";
import {up,TRANSACTIONAL_ID,setTransactionalId} from '../config'
import { AccountResource, isUpApiError } from "up-bank-api";
import { errorType, sessionExpiredType } from "../Types/Axios/controllersTypes";

export async function getTransactionalAccountHandler(req: Request, res: Response<AccountResource | sessionExpiredType | errorType>, next: NextFunction){

    try {

        if(req.session.myData){

          const accounts = await up.accounts.list()
          const transactionAccountID = accounts.data.find(val => val.attributes.accountType == "TRANSACTIONAL")?.id as string

          setTransactionalId(transactionAccountID)

          const tranactionalAccount = await up.accounts.retrieve(TRANSACTIONAL_ID as string)
  
          res.json(tranactionalAccount.data)
  
        }
        
        } catch (e) {
          if (isUpApiError(e)) {
            // Handle error returned from Up API
            res.json({error: "Something has gone wrong.."});
          }

          else{
            res.json({error: "Something has gone wrong.."})
          }

    
        }
      
}
