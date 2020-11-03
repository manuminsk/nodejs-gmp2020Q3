import { App } from './app';
import { logger } from './common/logger';
import { GroupController } from './controllers/group.controller';
import { HomeController } from './controllers/home.controller';
import { UserController } from './controllers/user.controller';
import { sequelize } from './data-access/database';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { GroupService } from './services/group.service';
import { UserService } from './services/user.service';

const root: string = '/api';
const userService: UserService = new UserService();
const groupService: GroupService = new GroupService();

const app: App = new App({
  port: 5000,
  controllers: [
    new HomeController(`${root}`),
    new UserController(`${root}/users`, userService),
    new GroupController(`${root}/groups`, groupService),
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
