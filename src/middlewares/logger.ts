import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { logger } from '../common/logger';

export const loggerMiddleware: (req: Request, resp: Response, next: NextFunction) => void = (
  req: Request,
  resp: Response,
  next: NextFunction,
) => {
  logger.info(`${req.method}: ${req.path} - ${JSON.stringify(req.body)}`);
  next();
};

export const errorMiddleware: (err: ErrorRequestHandler, req: Request, resp: Response, next: NextFunction) => void = (
  err: ErrorRequestHandler,
  req: Request,
  resp: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  logger.error(`${req.method}: ${req.path} - ${err}`);
  resp.status(500).send();
};
