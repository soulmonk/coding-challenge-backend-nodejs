import Koa = require('koa');
import {creatRouter} from './routes';

export const RestServer = (app: Koa) => {

  const router = creatRouter();

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
