import {Context} from 'koa';

export function live(ctx: Context) {
  ctx.status = 200;
  ctx.body = {success: true};
}
