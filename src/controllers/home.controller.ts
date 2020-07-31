import { Request, Response, Router } from 'express';
import { IControllerBase } from 'src/interfaces/controller-base.interface';

export class HomeController implements IControllerBase {
  public path = '/';
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.index);
  }

  private index = (req: Request, res: Response) => {
    const users = [
      {
        id: 1,
        name: 'Ali'
      },
      {
        id: 2,
        name: 'Can'
      },
      {
        id: 3,
        name: 'Ahmet'
      }
    ];

    res.status(200).send(users);
  };
}
