import * as Joi from '@hapi/joi';

export const create: Joi.SchemaMap = {
  fullName: Joi.string().required()
};
