import * as Router from 'koa-router';
import {validate} from '../middleware/validator';
import * as controller from './controller';
import * as validators from './validators';

export function routes(main: Router): Router {
  const router = new Router();

  router.get('/',
    validate({request: {query: validators.list}}),
    controller.list);

  router.post('/',
    validate({request: {body: validators.create}}),
    controller.create);

  router.put('/:id',
    validate({params: validators.resolve}),
    controller.resolve);

  main.use('/api/case', router.routes());

  return main;
}
