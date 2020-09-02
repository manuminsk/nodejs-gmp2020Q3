import express, { Application } from 'express';
import { Sequelize } from 'sequelize';

import { IControllerBase } from './interfaces/controller-base.interface';

export class App {
  public app: Application;
  public port: number;
  public db: Sequelize;

  constructor(config: { port: number; middleWares: any; controllers: IControllerBase[]; db: Sequelize }) {
    this.app = express();
    this.port = config.port;
    this.db = config.db;

    this.middleWares(config.middleWares);
    this.routes(config.controllers);
  }

  private middleWares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }): void {
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
