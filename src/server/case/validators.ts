import * as Joi from '@hapi/joi';
import {TBikeType} from '@models/Case';

const BikeTypes = Object.values(TBikeType);

export const list: Joi.SchemaMap = { // TODO min values
  type: Joi.string().valid(BikeTypes),
  ownerName: Joi.string(),
  color: Joi.string(),
  policeId: [Joi.number(), Joi.allow('')],
  resolved: Joi.boolean(),
  // todo theft description ?
};

export const resolve: Joi.SchemaMap = {
  id: Joi.number().required()
};

export const create: Joi.SchemaMap = {
  type: Joi.string().valid(BikeTypes),
  ownerName: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  color: Joi.string().required(),
  date: Joi.date().required(),
  theftDescription: Joi.string().required()
};
