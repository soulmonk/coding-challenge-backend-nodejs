import * as Koa from 'koa';
import {creatRouter} from './routes';

// todo split to rest + graphql
export const RestServer = (app: Koa) => {

  const router = creatRouter();

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
