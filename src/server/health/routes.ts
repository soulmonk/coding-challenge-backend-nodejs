import * as Router from 'koa-router';
import {live} from './controller';

export function routes(main: Router): Router {
  main.get('/live', live);

  return main;
}
