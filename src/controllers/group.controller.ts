import { Request, Response, Router } from 'express';
import status from 'http-status';

import Joi from '@hapi/joi';

import { logger } from '../common/logger';
import { authMiddleware } from '../middlewares/auth.middleware';
import { IGroup } from '../models/group.interface';
import { GroupService } from '../services/group.service';
import { groupCreateValidationSchema, groupUpdateValidationSchema } from '../validation-schemas/group.schema';
import { IControllerBase } from './controller-base.interface';

export class GroupController implements IControllerBase {
  public router: Router = Router();

  constructor(public readonly path: string, private readonly groupService: GroupService) {
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.use(authMiddleware);
    this.router.delete('/:id', this.deleteGroup);
    this.router.get('/:id', this.getGroupById);
    this.router.get('/', this.getGroupList);
    this.router.post('/:id/add-users', this.addUsersToGroup);
    this.router.post('/', this.createGroup);
    this.router.put('/:id', this.updateGroup);
  }

  private getGroupList: (req: Request, res: Response) => void = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const groups: IGroup[] = await this.groupService.getAllGroups();

      res.status(status.OK).send(groups);
    } catch (error) {
      logger.error(`getGroupList(): ${JSON.stringify(error)}`);
    }
  };

  private getGroupById: (req: Request, res: Response) => void = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const group: IGroup | null = await this.groupService.getGroupById(req.params.id);

      if (group) {
        res.status(status.OK).send(group);
      } else {
        res.sendStatus(status.NOT_FOUND);
      }
    } catch (error) {
      logger.error(`getGroupById(${req.params.id}): ${JSON.stringify(error)}`);
    }
  };

  private createGroup: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    try {
      const result: Joi.ValidationResult = groupCreateValidationSchema.validate(req.body);

      if (result.error) {
        res.status(status.BAD_REQUEST).send(result.error.message);
      } else {
        res.status(status.CREATED).send(this.groupService.createGroup(req.body));
      }
    } catch (error) {
      logger.error(`createGroup(${JSON.stringify(req.body)}): ${JSON.stringify(error)}`);
    }
  };

  private updateGroup: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    try {
      const result: Joi.ValidationResult = groupUpdateValidationSchema(req.params.id).validate(
        req.body,
      );

      if (result.error) {
        res.status(status.BAD_REQUEST).send(result.error.message);
      } else {
        res.status(status.NO_CONTENT).send(this.groupService.updateGroup(req.params.id, req.body));
      }
    } catch (error) {
      logger.error(`updateGroup(${req.params.id}): ${JSON.stringify(error)}`);
    }
  };

  private deleteGroup: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    try {
      res.status(status.NO_CONTENT).send(this.groupService.deleteGroup(req.params.id));
    } catch (error) {
      logger.error(`deleteGroup(${req.params.id}): ${JSON.stringify(error)}`);
    }
  };

  private addUsersToGroup: (req: Request, res: Response) => void = (
    req: Request,
    res: Response,
  ) => {
    try {
      res
        .status(status.NO_CONTENT)
        .send(this.groupService.addUsersToGroup(req.params.id, req.body.users));
    } catch (error) {
      logger.error(
        `addUsersToGroup(${req.params.id}, ${JSON.stringify(req.body.users)}): ${JSON.stringify(
          error,
        )}`,
      );
    }
  };
}
