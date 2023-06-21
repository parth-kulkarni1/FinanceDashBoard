import { Request, Response } from "express";
import { sessionExpiredRouteType } from "../Types/Axios/controllersTypes";

export async function checkSessionExpiry(req: Request, res: Response<sessionExpiredRouteType>){

    if (req.session && req.session.cookie.expires && new Date() > req.session.cookie.expires) {
      // Session has expired
      res.json({ expired: true });
    } else {
      // Session is still active
      res.json({ expired: false });
    }
}