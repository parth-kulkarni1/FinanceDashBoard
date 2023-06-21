import { Request, Response, NextFunction } from "express";
import { sessionExpiredType } from "./Types/Axios/controllersTypes";

function checkSessionExpiration(req: Request, res: Response<sessionExpiredType>, next: NextFunction) {

  if (req.session.cookie.expires && new Date() > req.session.cookie.expires) {
    // Session has expired, perform necessary actions (e.g., clear session data, log out user)
    delete req.session.myData;
    req.session.destroy(() => {});
    return res.status(401).json({ message: 'Session expired' });
  }

  next();
}

export default checkSessionExpiration;
