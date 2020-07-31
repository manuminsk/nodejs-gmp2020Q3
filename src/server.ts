import * as bodyParser from 'body-parser';

import { App } from './app';
import { HomeController } from './controllers/home.controller';
import { loggerMiddleware } from './middlewares/logger';

const app: App = new App({
  port: 5000,
  controllers: [new HomeController()],
  middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true }), loggerMiddleware],
});

app.listen();
