import cors, { CorsOptions } from 'cors';
import express, { Application, json } from 'express';
import { Sequelize } from 'sequelize';

import { IControllerBase } from './controllers/controller-base.interface';
import { errorMiddleware } from './middlewares/logger.middleware';

export class App {
  public app: Application;
  public port: number;
  public db: Sequelize;
  public corsOptions: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  constructor(config: { port: number; middleWares: any; controllers: IControllerBase[]; db: Sequelize }) {
    this.app = express();
    this.port = config.port;
    this.db = config.db;

    this.middleWares(config.middleWares);
    this.routes(config.controllers);
    this.app.use(errorMiddleware);
  }

  private middleWares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }): void {
    this.app.use(cors(this.corsOptions));
    this.app.use(json());

    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: { forEach: (arg0: (controller: IControllerBase) => void) => void }): void {
    controllers.forEach(controller => {
      this.app.use(controller.path, controller.router);
    });
  }

  public async listen(): Promise<void> {
    try {
      await this.db.authenticate();
      // eslint-disable-next-line no-console
      console.log('Connection has been established successfully.');

      await this.db.sync({ alter: true });

      this.app.listen(this.port, () => {
        // eslint-disable-next-line no-console
        console.log(`App listening on the http://localhost:${this.port}`);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unable to connect to the database:', error);
    }
  }
}
