import {logger} from '@services/logger';
import {Server} from 'http';
import Koa = require('koa');
import {Pool} from 'pg';
import {postgraphile} from 'postgraphile';
import {TServerConfiguration} from './configuration';
import {RestServer} from './rest';
import {GraphqlServer} from './graphql';

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

  listen() {
    this._server = this._app.listen(this._config.port, () => {
      logger.info('Server running on port ' + this._config.port);
    });

    return this._server;
  }

  private init() {
    RestServer(this._app);

    GraphqlServer(this._app);

    // temporary
    const pgPool = new Pool({
      database: 'challenge',
      user: 'challenge',
      password: 'toor',
      host: '127.0.0.1'
    });
    this._app.use(postgraphile(pgPool, null, {
      graphqlRoute: '/postgraphile_graphql'
    }));
  }
}
