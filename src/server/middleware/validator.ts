import * as Joi from '@hapi/joi';
import {logger} from '@services/logger';
import {constants} from 'http2';
import {Context} from 'koa';
import {IMiddleware} from 'koa-router';

export interface ISchemaMap {
  params?: {[key: string]: Joi.SchemaLike};

  request?: {
    query?: {[key: string]: Joi.SchemaLike} | Joi.ArraySchema
    body?: {[key: string]: Joi.SchemaLike} | Joi.ArraySchema
    headers?: {[key: string]: Joi.SchemaLike}
  };

  response?: {
    body?: {[key: string]: Joi.SchemaLike} | Joi.ArraySchema
    headers?: {[key: string]: Joi.SchemaLike}
  };
}

export function validate(schema: ISchemaMap): IMiddleware {
  return async (ctx: Context, next: () => Promise<any>) => {
    const valResult = Joi.validate(ctx, schema, {
      abortEarly: false,
      allowUnknown: true
    });

    if (valResult.error) {
      logger.error('Validation error: ', valResult.error);
      ctx.status = constants.HTTP_STATUS_BAD_REQUEST;
      ctx.body = {
        error: valResult.error.message,
        data: valResult.error.details.map(f => ({
          message: f.message,
          path: f.path,
          type: f.type
        }))
      };
      return;
    }

    await next();
  };
}
