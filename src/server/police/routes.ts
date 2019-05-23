import * as Router from 'koa-router';
import {create} from './controller';

export function routes(main: Router): Router {
  const router = new Router();

  router.post('/', create);

  main.use('/api/police', router.routes());

  return main;
}
