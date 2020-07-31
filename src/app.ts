import express, { Application } from 'express';

import { IControllerBase } from './interfaces/controller-base.interface';

export class App {
  public app: Application;
  public port: number;

  constructor(config: { port: number; middleWares: any; controllers: any }) {
    this.app = express();
    this.port = config.port;

    this.middlewares(config.middleWares);
    this.routes(config.controllers);
  }

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }): void {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: { forEach: (arg0: (controller: IControllerBase) => void) => void }): void {
    controllers.forEach(controller => {
      console.log('controller', controller.path);
      this.app.use(controller.path, controller.router);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}
