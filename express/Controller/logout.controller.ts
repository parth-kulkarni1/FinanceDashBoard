import { Request, Response, NextFunction } from "express";

export async function logoutHandler(req: Request, res:Response, next: NextFunction){

    res.json({message: 'Logout successful'})

}