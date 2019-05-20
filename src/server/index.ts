import * as Koa from 'koa';
import * as Router from 'koa-router';
import {TServerConfiguration} from './configuration';
import {Server} from 'http';

export class ApplicationServer {
  private _app: Koa;
  private _mainRouter: Router;
  private _config: TServerConfiguration;
  private _server: Server;

  constructor(config: TServerConfiguration) {
    this._app = new Koa();
    this._mainRouter = new Router();
    this._config = config;
  }

  initMiddleware() {

  }

  initApi() {

  }

  listen() {
    this._server = this._app.listen(this._config.port)
  }

  server() {
    return this._server;
  }
}

export const createServer = (config: TServerConfiguration): ApplicationServer => {

  const appServer = new ApplicationServer(config);

  appServer.initMiddleware();
  appServer.initApi();

  return appServer;
};

