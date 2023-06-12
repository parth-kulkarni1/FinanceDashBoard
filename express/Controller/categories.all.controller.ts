// This controller retrieves all the parentCategory and their respective child categories and returned to the front-end 

import { Request, Response, NextFunction } from "express";
import { up } from "../config";

export async function getAllCategoriesHandler(req: Request, res: Response, next:NextFunction){
    
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

}