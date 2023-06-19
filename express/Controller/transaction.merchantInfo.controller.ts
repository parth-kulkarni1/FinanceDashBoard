// This controller retrieves the merchant information 

import { Request, Response, NextFunction } from "express";
import axios from "axios";

export async function getMerchantInfoHandler(req:Request<{id: string}>, res:Response<any | null>, next:NextFunction){
    
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
}