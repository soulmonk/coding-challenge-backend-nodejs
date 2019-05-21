import {Context} from 'koa';
import * as Router from 'koa-router';
import * as HealthController from './health';

function notFound(ctx: Context) {
  ctx.status = 404;
  ctx.body = {}; // todo or empty body
}

export const creatRouter = (): Router => {
  const router = new Router();

  HealthController.routes(router);

  router.use(notFound);

  return router;
};
