'use strict';

import {logger} from '@services/logger';
import {constants} from 'http2';
import {Context} from 'koa';
import {IMiddleware} from 'koa-router';

export default (): IMiddleware => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err) {
      logger.error('Error handler', err);
      ctx.status = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
      ctx.body = {success: false, error: 'Something went wrong'};
    }
  };
};
