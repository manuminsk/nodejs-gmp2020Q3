import { NextFunction, Request, Response } from 'express';

export const loggerMiddleware = (req: Request, resp: Response, next: NextFunction) => {
  console.log('Request logged:', req.method, req.path);
  next();
};
