// This controller calculates the monthly parent-category costs breakdown for a respective month

import { Request, Response, NextFunction } from "express";
import { up } from "../config";


import moment from "moment";

export async function getMonthlyParentCategorySpending(req: Request, res: Response, next: NextFunction){
    
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
}