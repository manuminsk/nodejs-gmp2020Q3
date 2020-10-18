import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ResponseCode } from '../common/common.const';
import { logger } from '../common/logger';

export const authMiddleware: (req: Request, res: Response, next: NextFunction) => void = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const bearerHeader: string | undefined = req.headers['authorization'];

  if (bearerHeader) {
    const bearer: string[] = bearerHeader.split(' ');
    const bearerToken: string = bearer[1];

    try {
      const jwtSecret: string = process.env.JWT_SECRET as string;
      jwt.verify(bearerToken, jwtSecret);

      next();
    } catch (error) {
      logger.error(`${req.method}: ${req.path} - ${error}`);
      res.status(ResponseCode.Forbidden).send();
    }
  } else {
    res.status(ResponseCode.Unauthorized).send();
  }
};
