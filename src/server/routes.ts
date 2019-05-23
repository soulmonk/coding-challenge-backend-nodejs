import {Context} from 'koa';
import * as Router from 'koa-router';

import {routes as healthRoutes} from './health/routes';
import {routes as policeRoutes} from './police/routes';

function notFound(ctx: Context) {
  ctx.status = 404;
  ctx.body = {}; // todo or empty body
}

export const creatRouter = (): Router => {
  const router = new Router();

  healthRoutes(router);
  policeRoutes(router);

  router.use(notFound);

  return router;
};
