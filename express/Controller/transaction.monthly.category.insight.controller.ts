// This controller breaks down the monthly categories of the month into nested order and returns that to front end

import { Request, Response, NextFunction } from "express";
import { up } from "../config";
import { childCategoryType, dataToReturnType, errorType } from "../Types/Axios/controllersTypes";


import moment from "moment";
import { ListTransactionsResponse, TransactionResource } from "up-bank-api";

export async function getMonthlyCategoryInsightsHandler (req:Request<{id:string}>, res: Response<dataToReturnType[] | errorType>, next: NextFunction){
    
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
    res.json({error: "Something has gone wrong here"})
  }

}