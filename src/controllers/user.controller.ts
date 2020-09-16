import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';

import Joi from '@hapi/joi';

import { ResponseCode } from '../common/common.const';
import { IUser } from '../models/user.interface';
import { UserService } from '../services/user.service';
import { userCreateValidationSchema, userUpdateValidationSchema } from '../validation-schemas/user.schema';
import { IControllerBase } from './controller-base.interface';

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

  private getUserList: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    const users: IUser[] = await this.userService.getAutoSuggestUsers(
      req.query.loginSubstring ? req.query.loginSubstring.toString() : '',
      Number(req.query.limit ?? 10),
    );

    res.status(ResponseCode.Success).send(users);
  };

  private getUserById: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    const user: IUser | null = await this.userService.getUserById(req.params.id);

    if (user) {
      res.status(ResponseCode.Success).send(user);
    } else {
      res.sendStatus(ResponseCode.NotFound);
    }
  };

  private createUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    const result: Joi.ValidationResult = userCreateValidationSchema.validate(req.body);

    if (result.error) {
      res.status(ResponseCode.BadRequest).send(result.error.message);
    } else {
      res.status(ResponseCode.Created).send(this.userService.createUser(req.body));
    }
  };

  private updateUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    const result: Joi.ValidationResult = userUpdateValidationSchema(req.params.id).validate(req.body);

    if (result.error) {
      res.status(ResponseCode.BadRequest).send(result.error.message);
    } else {
      res.status(ResponseCode.NoContent).send(this.userService.updateUser(req.params.id, req.body));
    }
  };

  private deleteUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(ResponseCode.NoContent).send(this.userService.deleteUser(req.params.id));
  };
}
