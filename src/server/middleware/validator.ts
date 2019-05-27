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

// todo rewrite as single validation: params, request (query, body, headers), response (body, headers)
export function validate(schema: ISchemaMap): IMiddleware {
  return async (ctx: Context, next: () => Promise<any>) => {
    const valResult = Joi.validate(ctx, schema, {
      abortEarly: false,
      allowUnknown: true,
      // stripUnknown: {
      //   objects: true // todo not working as expected: remove extra fields
      // }
    });

    if (valResult.error) {
      // todo prettify result
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

    // todo find better way to omit extra values
    if (schema.params) {
      ctx.params = valResult.value.params;
    }
    if (schema.request) {
      if (schema.request.body) {
        ctx.request.body = valResult.value.request.body;
      }
      if (schema.request.query) {
        console.log('validator.ts::::57 >>>', ctx.request.query);
        console.log('validator.ts::::57 >>>', valResult.value.request.query);
        ctx.request.query = valResult.value.request.query;
      }
    }

    await next();
  };
}
