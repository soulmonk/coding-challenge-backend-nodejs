import * as Koa from 'koa';
import * as Router from 'koa-router';
import {Application} from './application';

export const createServer = (application: Application) => {

  const app = new Koa();
  const router = new Router();

  app.use(router.routes());

  return app;
};

