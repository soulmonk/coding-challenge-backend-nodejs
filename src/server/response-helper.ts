'use strict';

import {Context} from 'koa';

/**
 * HTTP Status codes
 */
export const STATUS_CODES = {
  CONTINUE: 100,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIME_OUT: 504
};

export const success = (ctx: Context, data: any = null, message: string = null) => {
  ctx.status = ctx.status < 400 ? ctx.status : STATUS_CODES.OK;
  ctx.body = {status: 'success', data, message};
};

export const fail = (ctx: Context, data: any = null, message: string = null) => {
  ctx.status = ctx.status >= 400 && ctx.status < 500
    ? ctx.status
    : STATUS_CODES.BAD_REQUEST;
  ctx.body = {status: 'fail', data, message};
};

export const error = (ctx: Context, code: number = null, message: string = null) => {
  ctx.status = ctx.status < 500
    ? STATUS_CODES.INTERNAL_SERVER_ERROR
    : ctx.status;
  ctx.body = {status: 'error', code, message};
};

export const ok = (ctx: Context, data: any, message: string) => {
  ctx.status = STATUS_CODES.OK;
  success(ctx, data, message);
};

export const created = (ctx: Context, data: any, message: string) => {
  ctx.status = STATUS_CODES.CREATED;
  success(ctx, data, message);
};

export const accepted = (ctx: Context, data: any, message: string) => {
  ctx.status = STATUS_CODES.ACCEPTED;
  success(ctx, data, message);
};

export const noContent = (ctx: Context, data: any, message: string) => {
  ctx.status = STATUS_CODES.NO_CONTENT;
  success(ctx, data, message);
};

export const badRequest = (ctx: Context, data: any, message: string) => {
  ctx.status = STATUS_CODES.BAD_REQUEST;
  fail(ctx, data, message);
};

export const forbidden = (ctx: Context, data: any, message: string) => {
  ctx.status = STATUS_CODES.FORBIDDEN;
  fail(ctx, data, message);
};

export const notFound = (ctx: Context, data: any, message: string) => {
  ctx.status = STATUS_CODES.NOT_FOUND;
  fail(ctx, data, message);
};

export const internalServerError = (ctx: Context, code: number, message: string) => {
  ctx.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
  error(ctx, code, message);
};

export const notImplemented = (ctx: Context) => {
  ctx.status = STATUS_CODES.NOT_IMPLEMENTED;
  error(ctx, null, 'Note Implemented');
};
