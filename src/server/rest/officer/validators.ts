import Joi = require('@hapi/joi');

export const create: Joi.SchemaMap = {
  fullName: Joi.string().required()
};
export const remove: Joi.SchemaMap = {
  id: Joi.number().required()
};
