import { json } from 'express';
import 'reflect-metadata';

import { App } from './app';
import { HomeController } from './controllers/home.controller';
import { UserController } from './controllers/user.controller';
import { sequelize } from './data-access/database';
import { loggerMiddleware } from './middlewares/logger';

const root: string = '/api';

const app: App = new App({
  port: 5000,
  controllers: [new HomeController(`${root}`), new UserController(`${root}/users`)],
  middleWares: [json(), loggerMiddleware],
  db: sequelize,
});

app.listen();
