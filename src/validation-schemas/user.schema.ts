import Joi from '@hapi/joi';

export const userCreateValidationSchema: Joi.ObjectSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().integer().min(4).max(130).required(),
  isDeleted: Joi.boolean().required(),
});

export const userUpdateValidationSchema: (id: string) => Joi.ObjectSchema = (id: string) =>
  Joi.object({
    id: Joi.string().equal(id).required(),
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(130).required(),
    isDeleted: Joi.boolean().required(),
  });
