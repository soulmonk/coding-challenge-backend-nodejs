import {DBConnection} from '@models/index';
import {Dialect} from 'sequelize';
import {ApplicationServer} from './server';
import {TConfiguration} from './configuration';

async function init() {
  const config: TConfiguration = {
    server: {
      port: 52300
    },
    db: {
      'database': 'challenge',
      'username': 'postgres',
      'password': 'root',
      'options': {
        'host': '127.0.0.1',
        'dialect': 'postgres' as Dialect
      }
    }
  };

  DBConnection.init(config.db);

  const server = new ApplicationServer(config.server);
  server.listen();

}

// noinspection JSIgnoredPromiseFromCall
init();
