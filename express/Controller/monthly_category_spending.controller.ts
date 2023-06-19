// This controller calculates the monthly parent-category costs breakdown for a respective month

import { Request, Response, NextFunction } from "express";
import { up } from "../config";
import { errorType, monthlyCategorySpendingResponse } from "../Types/Axios/controllersTypes";

import moment from "moment";

export async function getMonthlyParentCategorySpending(req: Request<{id:string}>, res: Response<monthlyCategorySpendingResponse[] | errorType>, next: NextFunction) {
  try {

    // Get the requested month start and end dates based on the provided query parameter
    const requestedMonthStart = moment(req.params.id, 'MMMM YYYY').toISOString();
    const requestedMonthEnd = moment(requestedMonthStart).endOf('month').toISOString();

    // Retrieve transactions data for the requested month using the Up API
    const data = await up.transactions.list({ filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100 });

    const categories_for_month: string[] = []; // Array to store the month
    const response: monthlyCategorySpendingResponse[] = []; // Array to store the response data

    // Loop through the transactions data to find unique parent category IDs
    for (let i = 0; i < data.data.length; i++) {
      const parentCategory = data.data[i].relationships.parentCategory.data?.id;

      if (parentCategory && categories_for_month.findIndex(val => val === parentCategory) === -1) {
        categories_for_month.push(parentCategory);
      }
    }

    // Loop through the unique parent category IDs and calculate the total spent for each category
    for (let k = 0; k < categories_for_month.length; k++) {
      const retrievedData = data.data.filter(item => item.relationships.parentCategory.data?.id === categories_for_month[k]);

      if (retrievedData.length > 1) {
        let spentOnCategory = 0;

        // Calculate the total spent on the category by summing up the amounts of each transaction
        retrievedData.forEach(item => spentOnCategory += Math.abs(parseFloat(item.attributes.amount.value)));

        response.push({
          category: categories_for_month[k],
          totalSpent: spentOnCategory
        });
      } else if (retrievedData.length === 1) {
        const spentOnCategory = Math.abs(parseFloat(retrievedData[0].attributes.amount.value));

        response.push({
          category: categories_for_month[k],
          totalSpent: spentOnCategory
        });
      } else {
        // If no transactions are found for the category, set the total spent to 0.0
        response.push({
          category: categories_for_month[k],
          totalSpent: 0.0
        });
      }
    }

    // Send the response as JSON
    res.json(response);
  } catch (err) {

    res.json({error: "Something has gone wrong in calculating your categorical spending"})

  }
}
