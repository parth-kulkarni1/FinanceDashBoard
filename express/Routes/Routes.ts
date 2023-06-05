import express, { Express, NextFunction, Router, response } from "express";
import { UpApi, isUpApiError, ListTransactionsResponse} from "up-bank-api";
import { Request, Response } from "express";
require('dotenv').config();

import moment from "moment";
import axios from "axios";

declare module 'express-session' {
  interface SessionData {
    myData: boolean;
  }
}


const up = new UpApi();

let TRANSACTIONAL_ID = ""
let SAVERS_ID = ""
let TOKEN = ""

const router = Router();


router.get('/login/:id', async function(req:Request, res:Response, next:NextFunction) {

  try{
      const token = req.params.id

      up.updateApiKey(token)
      TOKEN = token

      const authenticated = await up.util.ping()

      req.session.myData = true // set cookie to login
      
      res.json(authenticated)

  } catch(e){

    if (isUpApiError(e)) {
      // Handle error returned from Up API
      res.json(null)
      return;
    }

    res.json(null) // Any other errors also to be treated as null
    
  }

  })


  router.get('/cookie', async function (req: Request, res:Response, next: NextFunction) {

    if(req.session.myData){

      res.json(true)

    }

    else{
      res.json(false)
    }

  })


  router.post('/logout', async function (req:Request, res:Response, next:NextFunction){

    delete req.session.myData;

  
    res.redirect('/')


  })


router.get('/accounts/transactional', async function (req: Request, res: Response) {

    try {

      if(req.session.myData){


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
    
    const {data} = await axios.get<ListTransactionsResponse>(next, { headers: {"Authorization" : `Bearer ${TOKEN}`} })

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


router.get('/transactional/monthly/graph/:id', async function (req: Request, res:Response, next:NextFunction){

  try{

    const requestedMonthStart = moment(req.params.id, 'MMMM YYYY').toISOString()

    const requestedMonthEnd = moment(requestedMonthStart).endOf('month').toISOString()

    const data = await up.transactions.list({filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100})


    let income = 0; 
    let spending = 0;

    for(let i = 0; i < data.data.length; i++){

      let value = parseFloat(data.data[i].attributes.amount.value);

      if(value >=0){ // This means that its some form of income

        income = income + value;

      }

      else{
        spending = spending + Math.abs(value);
      }

    }

    res.json([{status:"income", income: income}, {status:"spending", spending: spending}]);

  }

  catch(err){
    if(isUpApiError(err)){
      res.json(err)
      return
    }

    res.json(err)


  }

})


router.get('/transactions/monthly/categories/:id', async function(req:Request, res:Response){

  try{

    const requestedMonthStart = moment(req.params.id, 'MMMM YYYY').toISOString()
    const requestedMonthEnd = moment(requestedMonthStart).endOf('month').toISOString()
    const data = await up.transactions.list({filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100})

    const categories_for_month:string[] = []

    const response = []

    for(let i = 0; i < data.data.length; i++){

      const parentCategory = data.data[i].relationships.parentCategory.data?.id

      if(parentCategory && categories_for_month.findIndex(val => val == parentCategory) === -1 ){
          categories_for_month.push(parentCategory)
      }
    }

    for (let k = 0; k < categories_for_month.length; k++){
      const reterivedData = data.data.filter(item => item.relationships.parentCategory.data?.id === categories_for_month[k])

      if(reterivedData.length > 1){

        let spentOnCategory = 0;

        reterivedData.forEach(item => spentOnCategory = spentOnCategory + Math.abs(parseFloat(item.attributes.amount.value)))

        response.push({
          category: categories_for_month[k],
          totalSpent: spentOnCategory

        })

      }

      else if(reterivedData.length === 1){

        const spentOnCategory = Math.abs(parseFloat(reterivedData[0].attributes.amount.value));

        response.push({
          category: categories_for_month[k],
          totalSpent: spentOnCategory
        })
      
      }

      else{

        response.push({
        category: categories_for_month[k],
        totalSpent: 0.0
        })
      
      }


    
    }


    res.json(response)





  } catch(err){
    console.log(err)
  }

})


router.get('/transactional/monthly/top10/:id', async function (req:Request, res:Response, next:NextFunction){

  try{
  
    const requestedMonthStart = moment(req.params.id, 'MMMM YYYY').toISOString()
    const requestedMonthEnd = moment(requestedMonthStart).endOf('month').toISOString()

    let allTransactions: ListTransactionsResponse[] = [];
    let nextPageToken = '';
  
    do {
      const response = await up.transactions.list({
        filterSince: requestedMonthStart,
        filterUntil: requestedMonthEnd,
        pageSize: 100,
      });
  
      allTransactions = allTransactions.concat(response);
      nextPageToken = response.links.next as string;
    } while (nextPageToken);


    type response = {
      companyName: string, 
      frequency: number
    }

    const data: response[] = []

    // We will now iterate through the array, and pick out only companies and allocate frequency of visits 

    for(let i = 0; i < allTransactions[0].data.length; i++){

      // First case if its the first item 

      const currentCompany = allTransactions[0].data[i]

      console.log(currentCompany)

      // Check ensure that only valid merchant purchases are being accessed 

      if(currentCompany.relationships.category.data !== null){

        if(i === 0){
          data.push({companyName: currentCompany.attributes.description,
                    frequency: 1
                    })
        }

        else{
          // Attempt to find the company, and if it does not exist add into data array 

          const itemIndex = data.findIndex(item => item.companyName === currentCompany.attributes.description)

          if(itemIndex === -1){ // Company does not exist

            data.push({
              companyName: currentCompany.attributes.description, 
              frequency: 1
            })

          }

          else{ // This company already exists, so we will have to just increment its frequency

            data[itemIndex].frequency = data[itemIndex].frequency + 1;
          }

        }    
      
      }

    }


    data.sort((a,b) => b.frequency - a.frequency)

    res.json(data.slice(0,5))
  
  }
  catch(err){
    res.json(err)
  }

})




export {router};