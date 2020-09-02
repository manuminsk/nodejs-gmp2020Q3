import * as dotenv from 'dotenv';
import { json } from 'express';
import 'reflect-metadata';
import { Sequelize } from 'sequelize';

import { App } from './app';
import { HomeController } from './controllers/home.controller';
import { UserController } from './controllers/user.controller';
import { loggerMiddleware } from './middlewares/logger';

const result: dotenv.DotenvConfigOutput = dotenv.config();

if (result.error) {
  throw result.error;
}

const root: string = '/api';

const app: App = new App({
  port: 5000,
  controllers: [new HomeController(`${root}`), new UserController(`${root}/users`)],
  middleWares: [json(), loggerMiddleware],
  db: new Sequelize(process.env.DB_CONNECTION_STRING as string),
});

app.listen();
