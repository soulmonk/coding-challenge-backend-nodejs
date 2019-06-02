import bodyParser = require('koa-bodyparser');
import {IMiddleware} from 'koa-router';

export default (): IMiddleware => bodyParser({
  enableTypes: ['json']
});
