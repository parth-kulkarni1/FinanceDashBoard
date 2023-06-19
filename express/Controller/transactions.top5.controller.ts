// This controller gets the most popular company that the user visited within a respective month

import { Request, Response, NextFunction } from "express";
import { up } from "../config";
import { errorType, listTop5CompaniesResponse } from "../Types/Axios/controllersTypes";


import moment from "moment";
import { ListTransactionsResponse } from "up-bank-api";

export async function getTransactionsTop5Handler(req: Request<{id:string}>, res: Response<listTop5CompaniesResponse[] | errorType>, next: NextFunction){
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
    
    
        const data: listTop5CompaniesResponse[] = []
    
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
        res.json({error: "Something has gone wrong in calculating your top 5 places in the month."})
      }


}