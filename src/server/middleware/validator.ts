import * as Joi from '@hapi/joi';
import {Context} from 'koa';
import {IMiddleware} from 'koa-router';

export class FieldValidationError extends Error {
  public fields: IFieldError[];
  public error: Error;

  constructor(message: string, fields: IFieldError[], error?: Error) {
    super(message);

    this.fields = fields;
    this.error = error;
  }

  public toModel() {
    return {
      message: this.message,
      fields: this.fields
    };
  }
}

export interface IFieldError {
  message: string;
  type: string;
  path: string[];
}

export interface ISchemaMap {
  params?: {[key: string]: Joi.SchemaLike};

  request?: {
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
      throw new FieldValidationError(
        valResult.error.message,
        valResult.error.details.map(f => ({
          message: f.message,
          path: f.path,
          type: f.type
        })),
        valResult.error
      );
    }

    await next();
  };
}
