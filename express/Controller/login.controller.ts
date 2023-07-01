import { Request, Response, NextFunction } from "express";
import {up,TOKEN, setToken} from '../config'
import { Pong, isUpApiError } from "up-bank-api";
import jwt from 'jsonwebtoken'
import { jwtConfig } from "../config";

export async function loginController(req:Request<{id: string}>, res:Response<string | null>, next:NextFunction) {

    try{  
        const token = req.params.id
  
        up.updateApiKey(token)
        
        setToken(token)
  
        const authenticated = await up.util.ping()

        if(authenticated.meta.id){
          const token = jwt.sign({id: authenticated.meta.id}, jwtConfig.jwtSecret, {
            expiresIn: jwtConfig.jwtExpiration
          })
        }

        else{
          res.json(null)
        }

        res.json(token)
  
    } catch(e){
  
      if (isUpApiError(e)) {
        // Handle error returned from Up API
        res.json(null)
        return;
      }
  
      res.json(null) // Any other errors also to be treated as null
      
    }
  
    }
