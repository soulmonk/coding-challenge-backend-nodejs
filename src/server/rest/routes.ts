import {Context} from 'koa';
import Router = require('koa-router');
import {routes as caseRoutes} from './case/routes';

import {routes as healthRoutes} from './health/routes';
import bodyParser from './middleware/bodyParser';
import errorHandler from './middleware/errorHandler';
import {default as loggerMiddleware} from './middleware/logger';
import {routes as officerRoutes} from './officer/routes';

function notFound(ctx: Context) {
  ctx.status = 404;
  ctx.body = {}; // todo or empty body
}

export const creatRouter = (): Router => {
  const router = new Router();

  router.prefix('/api');

  router
    .use(loggerMiddleware())
    .use(errorHandler())
    .use(bodyParser());

  healthRoutes(router);
  officerRoutes(router);
  caseRoutes(router);

  router.use(notFound);

  return router;
};
