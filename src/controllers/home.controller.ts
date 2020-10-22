import { Request, Response, Router } from 'express';
import status from 'http-status';

import { IControllerBase } from './controller-base.interface';

export class HomeController implements IControllerBase {
  public router: Router = Router();

  constructor(public readonly path: string) {
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get('/', this.index);
  }

  private index: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(status.OK).send({ message: 'Hello World!' });
  };
}
