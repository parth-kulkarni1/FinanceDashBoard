import express, { Express, NextFunction, Router } from "express";
import { UpApi, isUpApiError, ListAccountResponse} from "up-bank-api";
import { Request, Response } from "express";
require('dotenv').config();


import moment from "moment";

const up = new UpApi(process.env.TOKEN);
const router = Router();


router.get('/accounts/transactional', async function (req: Request, res: Response) {

    try {
        const accounts = await up.accounts.retrieve(process.env.TRANSACTIONAL_ID as string)

        res.json(accounts.data)
      } catch (e) {
        if (isUpApiError(e)) {
          // Handle error returned from Up API
          console.log(e.response.data.errors);
        }
    
        // Unexpected error
        throw e;
      }
    }
    
)

router.get('/accounts/savings', async function (req: Request, res: Response) {

  try {
      const savingAccount = await up.accounts.retrieve(process.env.SAVERS_ID as string)


      res.json(savingAccount.data);

    } catch (e) {
      if (isUpApiError(e)) {
        // Handle error returned from Up API
        console.log(e.response.data.errors);
      }
  
      // Unexpected error
      throw e;
    }
  }
  
)


router.get('/accounts/transactional/transactions', async function (req: Request, res: Response) {

  try{

      const transactions = await up.transactions.list();
      
      res.json(transactions)
      


  }

  catch(e){

      if (isUpApiError(e)) {
        // Handle error returned from Up API
        console.log(e.response.data.errors);
      }

      // Unexpected error
      throw e;

  }


})

router.get('/accounts/trasactional/monthly', async function (req:Request, res: Response) {

  
  try{

    const startOfMonth = moment().startOf('month').toISOString()

    const transactions = await up.transactions.listByAccount(process.env.TRANSACTIONAL_ID as string, {filterSince: startOfMonth });
    
    let total: number = 0;

    // Calculate the monthly cost 

    for(let i = 0; i < transactions.data.length; i++){

      if(transactions.data[i].relationships.transferAccount.data === null){

          total = total + Math.abs(parseFloat(transactions.data[i].attributes.amount.value))

      }

    }

    res.json(total.toFixed(2))


  }

  catch(e){

    if (isUpApiError(e)) {
      // Handle error returned from Up API
      console.log(e.response.data.errors);
    }

    // Unexpected error
    throw e;

  }





})


export {router};