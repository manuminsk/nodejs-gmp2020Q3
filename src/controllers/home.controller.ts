import { Request, Response, Router } from 'express';
import { IControllerBase } from 'src/interfaces/controller-base.interface';

export class HomeController implements IControllerBase {
  public path: string = '/';
  public router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get('/', this.index);
  }

  private index: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    const users: { id: number; name: string }[] = [
      {
        id: 1,
        name: 'Ali',
      },
      {
        id: 2,
        name: 'Can',
      },
      {
        id: 3,
        name: 'Ahmet',
      },
    ];

    res.status(200).send(users);
  };
}
