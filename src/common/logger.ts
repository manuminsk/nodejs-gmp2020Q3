import winston from 'winston';

import { CommonConfig } from './common.config';

export const logger: winston.Logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (CommonConfig.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}
