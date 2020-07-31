import { Request, Response, Router } from 'express';
import { IControllerBase } from 'src/interfaces/controller-base.interface';
import { IUser } from 'src/interfaces/user.interface';
import { container } from 'tsyringe';

import { UserService } from '../services/user.service';

export class UserController implements IControllerBase {
  public router: Router = Router();
  private userService: UserService;

  constructor(public readonly path: string) {
    this.initRoutes();
    this.userService = container.resolve(UserService);
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
      this.userService.getAutoSuggestUsers(
        req.query.loginSubstring ? req.query.loginSubstring.toString() : '',
        Number(req.query.limit),
      ),
    );
  };

  private getUserById: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    const user: IUser | undefined = this.userService.getUserById(req.params.id);

    if (user) {
      res.status(200).send(user);
    } else {
      res.sendStatus(404);
    }
  };

  private createUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(201).send(this.userService.createUser(req.body));
  };

  private updateUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(204).send(this.userService.updateUser(req.params.id, req.body));
  };

  private deleteUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(204).send(this.userService.deleteUser(req.params.id));
  };
}
