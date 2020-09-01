import { NextFunction, Request, Response } from 'express';

export const loggerMiddleware: (req: Request, resp: Response, next: NextFunction) => void = (
  req: Request,
  resp: Response,
  next: NextFunction,
) => {
  // eslint-disable-next-line no-console
  console.log('Request logged:', req.method, req.path);
  next();
};
