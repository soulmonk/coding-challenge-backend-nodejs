import {logger} from '@services/logger';
import {PoliceService as Service} from '@services/police';
import {Context} from 'koa';

export async function create(ctx: Context) {
  logger.debug('some debug', ctx.request.body);
  ctx.body = {
    data: await Service.create(ctx.request.body)
  };
}
