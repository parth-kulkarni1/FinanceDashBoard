// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { jwtConfig } from './config';

type TokenPayload = {
  id: string;

  // Contains properties of token payload

}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.json({ message: 'No token provided' });
  }

  try {
    
    const decoded = jwt.verify(token, jwtConfig.jwtSecret) as TokenPayload;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.json({ message: 'Token expired' });
    }
    return res.json({ message: 'Invalid token' });
  }
};
