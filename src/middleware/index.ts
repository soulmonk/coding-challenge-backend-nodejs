import * as Koa from 'koa';
import bodyParser from './bodyParser';

export const init = (app: Koa) => {
  app.use(bodyParser())
};
