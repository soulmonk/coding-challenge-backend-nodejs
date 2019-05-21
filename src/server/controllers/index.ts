import * as Router from 'koa-router';

import * as HealthController from './health';

export const creatRouter = (): Router => {
  const router = new Router();

  HealthController.routes(router);

  return router;
};
