import { Request, Response, NextFunction } from "express";
import {up,TOKEN, setToken} from '../config'
import { Pong, isUpApiError } from "up-bank-api";

export async function loginController(req:Request<{id: string}>, res:Response<Pong | null>, next:NextFunction) {

    try{  
        const token = req.params.id
  
        up.updateApiKey(token)
        
        setToken(token)
  
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
  
    }
