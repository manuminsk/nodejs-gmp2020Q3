import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

const logger: winston.Logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

export const loggerMiddleware: (req: Request, resp: Response, next: NextFunction) => void = (
  req: Request,
  resp: Response,
  next: NextFunction,
) => {
  logger.info(`${req.method}: ${req.path} - ${JSON.stringify(req.body)}`);
  next();
};
