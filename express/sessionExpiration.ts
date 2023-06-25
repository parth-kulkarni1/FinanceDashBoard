import { Request, Response, NextFunction } from "express";
import { sessionExpiredType } from "./Types/Axios/controllersTypes";

function checkSessionExpiration(req: Request, res: Response<string>, next: NextFunction) {

  if (req.session.cookie.expires && new Date() > req.session.cookie.expires) {
    // Session has expired, perform necessary actions (e.g., clear session data, log out user)

    req.session.myData = null
    
    req.session.destroy((err) => {
        res.clearCookie("UP-APP-COOKIE", {path: "/"}).send('clearedd cookie')
    });
  
  }

  else{
    next();
  }



}

export default checkSessionExpiration;
