import 'reflect-metadata';

import { App } from './app';
import { logger } from './common/logger';
import { GroupController } from './controllers/group.controller';
import { HomeController } from './controllers/home.controller';
import { UserController } from './controllers/user.controller';
import { sequelize } from './data-access/database';
import { loggerMiddleware } from './middlewares/logger.middleware';

const root: string = '/api';

const app: App = new App({
  port: 5000,
  controllers: [
    new HomeController(`${root}`),
    new UserController(`${root}/users`),
    new GroupController(`${root}/groups`),
  ],
  middleWares: [loggerMiddleware],
  db: sequelize,
});

app.listen();

process.on('uncaughtException', error => {
  logger.error(`uncaughtException: ${JSON.stringify(error)}`);
});

process.on('unhandledRejection', error => {
  logger.error(`unhandledRejection: ${JSON.stringify(error)}`);
});
