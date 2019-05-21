import {logger} from '@services/logger';
import {Server} from 'http';
import * as Koa from 'koa';
import {TServerConfiguration} from './configuration';
import {creatRouter} from './controllers';
import bodyParser from './middleware/bodyParser';
import errorHandler from './middleware/errorHandler';

export class ApplicationServer {
  private _app: Koa;
  private _config: TServerConfiguration;
  private _server: Server;

  constructor(config: TServerConfiguration) {
    this._app = new Koa();
    this._config = config;

    this.init();
  }

  listen() {
    this._server = this._app.listen(this._config.port, () => {
      logger.info('Server running on port ' + this._config.port);
    });
  }

  server() {
    return this._server;
  }

  private init() {
    this.initMiddleware();
    this.initWebApi();
  }

  private initMiddleware() {
    this._app
      .use(errorHandler())
      .use(bodyParser());
  }

  private initWebApi() {
    const router = creatRouter();

    this._app
      .use(router.routes())
      .use(router.allowedMethods());
  }
}
