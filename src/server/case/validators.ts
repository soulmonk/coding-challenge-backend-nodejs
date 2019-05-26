import * as Joi from '@hapi/joi';
import {TBikeType} from '@models/Case';

const BikeTypes = Object.values(TBikeType);

export const list: Joi.SchemaMap = {
  type: Joi.string().valid(BikeTypes),
  ownerName: Joi.string(),
  color: Joi.string(),
  policeId: Joi.number(),
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
  policeOfficerName: Joi.string().required(),
  color: Joi.string().required(),
  theftDescription: Joi.string().required()
};
