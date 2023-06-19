// This file sets the SAVERS ID, essentially

import { Request, Response, NextFunction } from "express";
import {up,SAVERS_ID,setSaversId} from '../config'
import { AccountResource, isUpApiError } from "up-bank-api";

export async function getSaversAccountHandler(req:Request, res:Response<AccountResource>, next:NextFunction){
    
    try {

        const accounts = await up.accounts.list()

        const saversAccountId = accounts.data.find(val => val.attributes.accountType == "SAVER")?.id as string

        setSaversId(saversAccountId)

        const savingsAccount = await up.accounts.retrieve(SAVERS_ID as string)

        res.json(savingsAccount.data);

    } catch (e) {
      if (isUpApiError(e)) {
        // Handle error returned from Up API
        console.log(e.response.data.errors);
      }
  
      // Unexpected error
      throw e;
    }

}
