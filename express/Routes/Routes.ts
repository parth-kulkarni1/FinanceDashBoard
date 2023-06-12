import express, { Express, NextFunction, Router, response } from "express";
import { UpApi, isUpApiError, ListTransactionsResponse, TransactionResource} from "up-bank-api";
import { Request, Response } from "express";
require('dotenv').config();

import moment from "moment";
import axios from "axios";
import { loginController } from "../Controller/login.controller";
import { getCookieHandler } from "../Controller/cookie.controller";
import { logoutHandler } from "../Controller/logout.controller";
import { getTransactionalAccountHandler } from "../Controller/accounts.transaction.controller";
import { getSaversAccountHandler } from "../Controller/accounts.savers.controller";
import { getTransactionsHandler } from "../Controller/transaction_acc.transaction.controller";
import { getMonthlyTotalSpendingHandler } from "../Controller/transactions.monthly.controller";

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


router.get('/login/:id', loginController)

router.get('/cookie', getCookieHandler)

router.post('/logout', logoutHandler)

router.get('/accounts/transactional', getTransactionalAccountHandler) 

router.get('/accounts/savings', getSaversAccountHandler)

router.get('/accounts/transactional/transactions', getTransactionsHandler)

router.get('/accounts/trasactional/monthly', getMonthlyTotalSpendingHandler)

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

      const validExpense = data.data[i].attributes.isCategorizable && data.data[i].attributes.amount.valueInBaseUnits < 0

      const validIncome = data.data[i].attributes.isCategorizable && data.data[i].attributes.amount.valueInBaseUnits > 0

      if(validIncome){ // This means that its some form of income

        income = income + value;

      }

      else if (validExpense){
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


router.get('/transactional/monthly/category/detailed/:id', async function (req:Request, res:Response, next:NextFunction){

  // Establish date boundaries
  const requestedMonthStart = moment(req.params.id, 'MMMM YYYY').toISOString() // Reterive the respective month
  const requestedMonthEnd = moment(requestedMonthStart).endOf('month').toISOString()


  try{

    
    // Lets retrieve all possible data now, since it's paginated

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


    const data = allTransactions[0]

    // Time to loop through the collected data and model it so we can present it to the front-end easily 

    type childCategoryType = {
      categoryName: string | undefined,
      transaction: TransactionResource[]
    }

    type dataToReturnType = {
      parentCategory: string | undefined, 
      childCategory: childCategoryType[]
    }

    // Contains an array of objects with object type defined above
    const DataToReturn: dataToReturnType[] = []


    /* Cases to consider 

      - The transaction must be an expense 
      - Need to set the parent category as the key in dictionary and append all child category to parent category
      - Conditional checks to check whether the parent category exists too
    */

    for(let i = 0; i < data.data.length; i++){

      let currentData = data.data[i]

      // Lets check whether its a valid expense

      if(currentData.attributes.isCategorizable && currentData.attributes.amount.valueInBaseUnits < 0 && currentData.relationships.parentCategory.data?.id !== undefined){
          
        // First case nothing exists so lets add this into our array

        if(i === 0){
          DataToReturn.push({
            parentCategory: currentData.relationships.parentCategory.data?.id,
            childCategory: [{categoryName: currentData.relationships.category.data?.id, transaction: [currentData]}]
          })
        }

        else{

          // This means we are not the first iteration 

          // Lets find if the parent category of the currentData exists in our array 

          const parentIndex = DataToReturn.findIndex(itemIndex => itemIndex.parentCategory === currentData.relationships.parentCategory.data?.id)


          if(parentIndex !== -1){
            // Means the parent category does exists, so lets append it

            const childCategory = DataToReturn[parentIndex].childCategory.find(item => item.categoryName === currentData.relationships.category.data?.id)

            if(childCategory){
              // This means that both parent category and child category exists

              childCategory.transaction.push(currentData)
            
            }

            else{
              // This means that the parent exists but the child category does not exist 

              DataToReturn[parentIndex].childCategory.push({categoryName:currentData.relationships.category.data?.id, transaction: [currentData]})

            }
            
          }

          else{

            // This means that parent does not exist at all, and child cannot exist without parent so this makes sense

            DataToReturn.push({
              parentCategory: currentData.relationships.parentCategory.data?.id,
              childCategory: [{categoryName: currentData.relationships.category.data?.id, transaction: [currentData]}]
            })

          }

        }

      }

    }

    res.json(DataToReturn)

  }

  catch(err){
    res.json(err)
  }

})

router.post('/transactions/add/tag', async function (req:Request, res:Response, next:NextFunction){


  try{
  
    const tagObj = req.body
    
    await up.tags.addTagsToTransaction(tagObj.transactionId, [tagObj.tags])

    res.sendStatus(204) // Sending 204 status code for success
  
  } catch(err){
    res.status(500).json({ error: 'An error occurred' });
  }


})


router.delete('/transactions/delete/tag', async function (req:Request, res:Response, next:NextFunction){

  try{
     const tabObj = req.body

     await up.tags.removeTagsFromTransaction(tabObj.transactionId,[tabObj.tags])

     res.sendStatus(204) // Sending 204 status code for success

  } catch (err){
    res.sendStatus(500).json({error: 'An error occurred'})
  }


})

router.get('/categories', async function (req:Request, res:Response, next:NextFunction){
  
  try{

    // Need to model the response of the data

    // Iterate through the array, grab the parent category and append child categories to  it

    type responseToReturnType = {
      parentCategory: string | undefined, 
      childCategory: {id: string, name: string}[]
    }

    let responseToReturn: responseToReturnType[] = []

    const data = await up.categories.list()

    for(let i = 0; i < data.data.length; i++){

      let currentCategoryParent = data.data[i].relationships.parent.data?.id;
      let currentCategoryName = data.data[i].attributes.name
      let currentCategoryId = data.data[i].id

      if(i === 0){
        // First item scenario
        responseToReturn.push({parentCategory: currentCategoryParent, childCategory: [{id:currentCategoryId, name: currentCategoryName}]})
      }

      else {

        // Now check if the parentCategory already exists 

        const parentCategoryIndex = responseToReturn.findIndex(item => item.parentCategory === currentCategoryParent)

        if(parentCategoryIndex === -1){
          // This means that the category does not exist

          responseToReturn.push({parentCategory: currentCategoryParent, childCategory: [{id:currentCategoryId, name: currentCategoryName}]})

        }

        else{
          // This means that the parent category does exist 

          responseToReturn[parentCategoryIndex].childCategory?.push({id:currentCategoryId, name: currentCategoryName})

        }

    
      }


    }

    res.json(responseToReturn)

  } catch (err){
    res.sendStatus(500).json({error: 'An error occurred'})
  }


})

router.patch('/categories/change', async function (req: Request, res: Response, next: NextFunction){

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

    const response = await axios.patch(`https://api.up.com.au/api/v1/transactions/${transactionID}/relationships/category`, data, {headers})

    if(response.status === 204){
        res.sendStatus(204)
    }

    else{
      res.sendStatus(500)
    }


  } catch(err){
    res.sendStatus(500).json({error: "An error has occurred."})
  }

})


export {router};