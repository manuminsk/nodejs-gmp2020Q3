import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';

import Joi from '@hapi/joi';

import { ResponseCode } from '../common/common.const';
import { IGroup } from '../models/group.interface';
import { GroupService } from '../services/group.service';
import { groupCreateValidationSchema, groupUpdateValidationSchema } from '../validation-schemas/group.schema';
import { IControllerBase } from './controller-base.interface';

export class GroupController implements IControllerBase {
  public router: Router = Router();
  private groupService: GroupService;

  constructor(public readonly path: string) {
    this.initRoutes();
    this.groupService = container.resolve(GroupService);
  }

  public initRoutes(): void {
    this.router.delete('/:id', this.deleteGroup);
    this.router.get('/:id', this.getGroupById);
    this.router.get('/', this.getGroupList);
    this.router.post('/', this.createGroup);
    this.router.put('/:id', this.updateGroup);
  }

  private getGroupList: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    const groups: IGroup[] = await this.groupService.getAllGroups();

    res.status(ResponseCode.Success).send(groups);
  };

  private getGroupById: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    const group: IGroup | null = await this.groupService.getGroupById(req.params.id);

    if (group) {
      res.status(ResponseCode.Success).send(group);
    } else {
      res.sendStatus(ResponseCode.NotFound);
    }
  };

  private createGroup: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    const result: Joi.ValidationResult = groupCreateValidationSchema.validate(req.body);

    if (result.error) {
      res.status(ResponseCode.BadRequest).send(result.error.message);
    } else {
      res.status(ResponseCode.Created).send(this.groupService.createGroup(req.body));
    }
  };

  private updateGroup: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    const result: Joi.ValidationResult = groupUpdateValidationSchema(req.params.id).validate(req.body);

    if (result.error) {
      res.status(ResponseCode.BadRequest).send(result.error.message);
    } else {
      res.status(ResponseCode.NoContent).send(this.groupService.updateGroup(req.params.id, req.body));
    }
  };

  private deleteGroup: (req: Request, res: Response) => void = (req: Request, res: Response) => {
    res.status(ResponseCode.NoContent).send(this.groupService.deleteGroup(req.params.id));
  };
}
