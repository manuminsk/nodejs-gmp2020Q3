import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import jwt from 'jsonwebtoken';

import { CommonConfig } from '../common/common.config';
import { logger } from '../common/logger';

export const authMiddleware: (req: Request, res: Response, next: NextFunction) => void = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearerHeader: string | undefined = req.get('authorization');

  if (bearerHeader) {
    const [, bearerToken] = bearerHeader.split(' ');

    try {
      const jwtSecret: string = CommonConfig.JWT_SECRET as string;
      jwt.verify(bearerToken, jwtSecret);

      next();
    } catch (error) {
      logger.error(`${req.method}: ${req.path} - ${error}`);
      res.status(status.FORBIDDEN).send();
    }
  } else {
    res.status(status.UNAUTHORIZED).send();
  }
};
