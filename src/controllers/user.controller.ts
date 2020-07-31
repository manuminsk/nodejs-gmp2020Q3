import { Request, Response, Router } from 'express';
import { IControllerBase } from 'src/interfaces/controller-base.interface';

export class UserController implements IControllerBase {
  public router: Router = Router();

  constructor(public readonly path: string) {
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get('/', this.getUserList);
    this.router.get('/:id', this.getUserById);
    this.router.post('/', this.getUserById);
    this.router.put('/:id', this.getUserById);
    this.router.delete('/:id', this.getUserById);
  }

  private getUserList: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(200).send({ message: 'Get User List!' });
  };

  private getUserById: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(200).send({ message: req.params.id });
  };

  private createUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(200).send({ message: 'Create!' });
  };

  private updateUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(200).send({ message: 'Update!' });
  };

  private deleteUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(200).send({ message: 'Delete!' });
  };
}
