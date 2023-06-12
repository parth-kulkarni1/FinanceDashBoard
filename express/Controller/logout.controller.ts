import { Request, Response, NextFunction } from "express";

export async function logoutHandler(req: Request, res:Response, next: NextFunction){
    
    delete req.session.myData;
    res.redirect('/')
}