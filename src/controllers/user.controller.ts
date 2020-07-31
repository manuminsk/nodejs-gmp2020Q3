import { Request, Response, Router } from 'express';
import { IControllerBase } from 'src/interfaces/controller-base.interface';
import { IUser } from 'src/interfaces/user.interface';

import { UserService } from '../services/user.service';

export class UserController implements IControllerBase {
  public router: Router = Router();

  constructor(public readonly path: string) {
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.delete('/:id', this.deleteUser);
    this.router.get('/:id', this.getUserById);
    this.router.get('/', this.getUserList);
    this.router.post('/', this.createUser);
    this.router.put('/:id', this.updateUser);
  }

  private getUserList: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.send(
      UserService.getAutoSuggestUsers(
        req.query.loginSubstring ? req.query.loginSubstring.toString() : '',
        Number(req.query.limit),
      ),
    );
  };

  private getUserById: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    const user: IUser | undefined = UserService.getUserById(req.params.id);

    if (user) {
      res.status(200).send(user);
    } else {
      res.sendStatus(404);
    }
  };

  private createUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(201).send(UserService.createUser(req.body));
  };

  private updateUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(204).send(UserService.updateUser(req.params.id, req.body));
  };

  private deleteUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(204).send(UserService.deleteUser(req.params.id));
  };
}
