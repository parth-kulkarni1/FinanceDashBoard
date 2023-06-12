
import { Request, Response, NextFunction } from "express";


export async function getCookieHandler(req:Request, res:Response, next:NextFunction){
    
    if(req.session.myData){
        res.json(true)
    }

    else{
    res.json(false)
  }

}