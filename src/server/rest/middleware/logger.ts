import * as logger from 'koa-logger';
import {IMiddleware} from 'koa-router';

export default (): IMiddleware => logger();
