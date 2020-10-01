import Joi from '@hapi/joi';

import { Permission } from '../models/group.interface';

const validPermissions: Permission[] = ['DELETE', 'WRITE', 'READ', 'SHARE', 'UPLOAD_FILES'];

export const groupCreateValidationSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array()
    .items(Joi.string().valid(...validPermissions))
    .required(),
});

export const groupUpdateValidationSchema: (id: string) => Joi.ObjectSchema = (id: string) =>
  Joi.object({
    id: Joi.string().equal(id).required(),
    name: Joi.string().required(),
    permissions: Joi.array()
      .items(Joi.string().valid(...validPermissions))
      .required(),
  });
