import { Request, Response, Router } from 'express';

import { ResponseCode } from '../common/common.const';
import { IControllerBase } from '../interfaces/controller-base.interface';

export class HomeController implements IControllerBase {
  public router: Router = Router();

  constructor(public readonly path: string) {
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get('/', this.index);
  }

  private index: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(ResponseCode.Success).send({ message: 'Hello World!' });
  };
}
