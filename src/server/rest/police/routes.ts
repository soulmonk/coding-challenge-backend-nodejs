import * as Router from 'koa-router';
import {validate} from '../middleware/validator';
import * as controller from './controller';
import * as validators from './validators';

export function routes(main: Router): Router {
  const router = new Router();

  router.get('/', controller.list);

  router.post('/',
    validate({request: {body: validators.create}}),
    controller.create);

  router.delete('/:id',
    validate({params: validators.remove}),
    controller.remove);

  main.use('/police', router.routes());

  return main;
}
