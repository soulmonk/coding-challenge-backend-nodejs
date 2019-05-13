import * as Koa from 'koa';
import * as Router from 'koa-router';

export const createServer = () => {

  const app = new Koa();
  const router = new Router();

  app.use(router.routes());

  return app;
};

