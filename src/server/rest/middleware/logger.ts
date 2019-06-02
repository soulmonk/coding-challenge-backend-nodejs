import logger = require('koa-logger');
import {IMiddleware} from 'koa-router';

export default (): IMiddleware => logger();
