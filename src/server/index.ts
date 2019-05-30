import {logger} from '@services/logger';
import {Server} from 'http';
import * as Koa from 'koa';
import {TServerConfiguration} from './configuration';
import {RestServer} from './rest';

export class ApplicationServer {
  private readonly _app: Koa;
  private _config: TServerConfiguration;
  private _server: Server;

  constructor(config: TServerConfiguration) {
    this._app = new Koa();
    this._config = config;

    this.init();
  }

  get app() {
    return this._app;
  }

  get server() {
    return this._server;
  }

  disconnect() {
    if (!this.server) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this._server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async listen() {
    await new Promise(resolve => {
      this._server = this._app.listen(this._config.port, () => {
        logger.info('Server running on port ' + this._config.port);
        resolve();
      });
    });

    return this._server;
  }

  private init() {
    RestServer(this._app);
  }
}
