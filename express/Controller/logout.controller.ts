import { Request, Response, NextFunction } from "express";

export async function logoutHandler(req: Request, res:Response, next: NextFunction){

    delete req.session.myData;
    
    req.session.destroy((err) => {
        res.clearCookie("UP-APP-COOKIE", {path: "/"}).send('clearedd cookie')
    });
}