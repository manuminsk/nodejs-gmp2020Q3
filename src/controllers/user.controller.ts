import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';

import Joi from '@hapi/joi';

import { ResponseCode } from '../common/common.const';
import { logger } from '../common/logger';
import { authMiddleware } from '../middlewares/auth.middleware';
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
    this.router.delete('/:id', authMiddleware, this.deleteUser);
    this.router.get('/:id', authMiddleware, this.getUserById);
    this.router.get('/', authMiddleware, this.getUserList);
    this.router.post('/', authMiddleware, this.createUser);
    this.router.post('/login', this.login);
    this.router.put('/:id', authMiddleware, this.updateUser);
  }

  private login: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } = req.body;

    try {
      const token: string | null = await this.userService.login(username, password);

      if (token) {
        res.status(ResponseCode.Success).send({ access_token: token });
      } else {
        res.status(ResponseCode.Unauthorized).send();
      }
    } catch (error) {
      logger.error(`login(${username}, ${password}): ${JSON.stringify(error)}`);
    }
  };

  private getUserList: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    const loginSubstring: string = req.query.loginSubstring ? req.query.loginSubstring.toString() : '';
    const limit: number = Number(req.query.limit ?? 10);
    try {
      const users: IUser[] = await this.userService.getAutoSuggestUsers(loginSubstring, limit);

      res.status(ResponseCode.Success).send(users);
    } catch (error) {
      logger.error(`getUserList(${loginSubstring}, ${limit}): ${JSON.stringify(error)}`);
    }
  };

  private getUserById: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    try {
      const user: IUser | null = await this.userService.getUserById(req.params.id);

      if (user) {
        res.status(ResponseCode.Success).send(user);
      } else {
        res.sendStatus(ResponseCode.NotFound);
      }
    } catch (error) {
      logger.error(`getUserById(${req.params.id}): ${JSON.stringify(error)}`);
    }
  };

  private createUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    try {
      const result: Joi.ValidationResult = userCreateValidationSchema.validate(req.body);

      if (result.error) {
        res.status(ResponseCode.BadRequest).send(result.error.message);
      } else {
        res.status(ResponseCode.Created).send(this.userService.createUser(req.body));
      }
    } catch (error) {
      logger.error(`createUser(${req.body}): ${JSON.stringify(error)}`);
    }
  };

  private updateUser: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    try {
      const result: Joi.ValidationResult = userUpdateValidationSchema(req.params.id).validate(req.body);

      if (result.error) {
        res.status(ResponseCode.BadRequest).send(result.error.message);
      } else {
        res.status(ResponseCode.NoContent).send(this.userService.updateUser(req.params.id, req.body));
      }
    } catch (error) {
      logger.error(`updateUser(${req.params.id}, ${req.body}): ${JSON.stringify(error)}`);
    }
  };

  private deleteUser: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    try {
      res.status(ResponseCode.NoContent).send(this.userService.deleteUser(req.params.id));
    } catch (error) {
      logger.error(`deleteUser(${req.params.id}): ${JSON.stringify(error)}`);
    }
  };
}
