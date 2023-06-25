import { Request, Response, NextFunction } from "express";

export async function logoutHandler(req: Request, res:Response, next: NextFunction){

    req.session.myData = null
    
    req.session.destroy((err) => {
        res.clearCookie("UP-APP-COOKIE", {path: "/"}).send('clearedd cookie')
    });
}