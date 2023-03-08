import express, { Express, Router } from "express";
import { UpApi, isUpApiError, ListAccountResponse} from "up-bank-api";
import { Request, Response } from "express";
require('dotenv').config();

const up = new UpApi(process.env.TOKEN);
const router = Router();


router.get('/accounts/transactional', async function (req: Request, res: Response) {

    try {
        const accounts = await up.accounts.retrieve()

        res.json(accounts)
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
      const accounts = await up.accounts.retrieve()

      const savingAccount = accounts.data[1].attributes.balance;

      res.json(savingAccount);

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


export {router};