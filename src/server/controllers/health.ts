import {Context} from 'koa';
import * as Router from 'koa-router';

function live(ctx: Context) {
  ctx.status = 200;
  ctx.body = {success: true};
}

export const routes = (main: Router): Router => {
  main.get('/live', live);

  return main;
};
