import express, { Express, NextFunction, Router } from "express";
import { UpApi, isUpApiError, ListTransactionsResponse} from "up-bank-api";
import { Request, Response } from "express";
require('dotenv').config();

import moment from "moment";
import axios from "axios";
import { brandFetchReterive } from "../Types/Axios/typeAxios";

import session, { Cookie } from "express-session";



const up = new UpApi();

let TRANSACTIONAL_ID = ""
let SAVERS_ID = ""

const router = Router();

declare module 'express-session' { interface Session { cookieGen: string}}


router.get('/login/:id', async function(req:Request, res:Response, next:NextFunction) {

  try{
      const token = req.params.id

      up.updateApiKey(token)

      const authenticated = await up.util.ping()

      req.session.cookieGen = token // set cookie to login
      
      res.json(authenticated)

  } catch(e){

    if (isUpApiError(e)) {
      // Handle error returned from Up API
      res.json(null)
    }

    res.json(null) // Any other errors also to be treated as null

    next(e) // Process the error on express
    
  }

  })


  router.get('/cookie', async function (req: Request, res:Response, next: NextFunction) {

    if(req.session.cookie){

      res.json(true)

    }

    else{
      res.json(false)
    }

  })


  router.post('/logout', async function (req:Request, res:Response, next:NextFunction){

    req.session.destroy(err  => {
      if(err){
        res.send({error: 'Logout error'})
      }

      res.clearCookie("connect.sid", {path:'/'})


      res.json("success")


    });

  })


router.get('/accounts/transactional', async function (req: Request, res: Response) {

    try {

      if(req.session.cookieGen){


        const accounts = await up.accounts.list()

        TRANSACTIONAL_ID = accounts.data.find(val => val.attributes.accountType == "TRANSACTIONAL")?.id as string

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
    
)

router.get('/accounts/savings', async function (req: Request, res: Response) {

  try {

        const accounts = await up.accounts.list()

        SAVERS_ID = accounts.data.find(val => val.attributes.accountType == "SAVER")?.id as string

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
  
)


router.get('/accounts/transactional/transactions', async function (req: Request, res: Response) {

  try{

      const transactions = await up.transactions.listByAccount(TRANSACTIONAL_ID);
      
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

    const transactions = await up.transactions.listByAccount(TRANSACTIONAL_ID, {filterSince: startOfMonth });
    
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

router.get('/transactions/next', async function(req: Request, res:Response){

  try{

    const next = req.query.link as string;
    
    const {data} = await axios.get<ListTransactionsResponse>(next, { headers: {"Authorization" : `Bearer ${process.env.TOKEN}`} })

    res.json(data)
    

  } catch(e){
    if (isUpApiError(e)) {
      console.log(e.response.data.errors)
    }
  }



})

router.get('/transactional/:id', async function (req:Request, res: Response, next: NextFunction){

  try{

    const description = req.params.id; 

    const optionsSearch = {
      method: 'GET', 
      headers: {
        accept: 'application/json',
        Referer: 'http://localhost'
      }

    }

    const optionsReterive = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.BRAND_FETCH_TOKEN}`
      }
    };
    

    const {data} = await axios.get<any>(`https://api.brandfetch.io/v2/search/${description}`, optionsSearch)
    
    const updated = data.filter((val:any) => val.name == description || val.domain.includes('au'))

    if(updated.length){ // Make another axios call to reterive more information about the merchant. The search returns a less detailed result

      const {data} = await axios.get<any>(`https://api.brandfetch.io/v2/brands/${updated[0].domain}`, optionsReterive)

      console.log(data)

      updated[0].domain = "https://" + updated[0].domain // Update the domain link

      data.domain = "https://" + data.domain // Update the domain link


      res.json({"brandInfo": updated[0], "domainInfo": data})
    }

    else{
      res.json(null)
    }

  
  } catch(e){

    next(e)

    res.json(e)

  }

})


router.post('/transactional/category', async function(req: Request, res:Response, next: NextFunction){

  try{

    const categoryDescription = req.body.categoryName
    const merchantName = req.body.merchantName

    const transactionsCategorised = await up.transactions.list({filterCategory: categoryDescription})

    const updated = transactionsCategorised.data.filter((val:any) => val.attributes.description === merchantName)


    // Now lets do some maths on the calculations..

    const numberOfTransactions = updated.length;
    let sumOfTransactions = 0;

    for(let i = 0; i < updated.length; i ++){


      sumOfTransactions += (Math.abs(parseFloat(updated[i].attributes.amount.value)))

    }

    const average = (sumOfTransactions / numberOfTransactions)

    const userMerchantSummary = {numberOfTransactions: numberOfTransactions, sumOfTransactions: sumOfTransactions, averageOfTransactions: average}

    res.json({transactionSummary: userMerchantSummary, pastTransactionsList: updated})

  } catch(e){
    console.log(e)
  }

})


export {router};