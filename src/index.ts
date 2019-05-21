import {DBConnection} from '@models/index';
import {logger} from '@services/logger';
import {Dialect} from 'sequelize';
import {TConfiguration} from './configuration';
import {ApplicationServer} from './server';

async function init() {
  const config: TConfiguration = {
    server: {
      port: 52300
    },
    db: {
      database: 'challenge',
      username: 'postgres',
      password: 'root',
      options: {
        host: '127.0.0.1',
        dialect: 'postgres' as Dialect
      }
    }
  };

  DBConnection.init(config.db);

  const server = new ApplicationServer(config.server);
  server.listen();

}

init()
  .catch(err => {
    logger.error('Something went wrong', err);
    process.exit(1);
  });
