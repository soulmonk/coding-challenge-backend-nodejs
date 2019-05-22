import {DBConnection} from '@models/index';
import {logger} from '@services/logger';

import * as config from 'config';
import {ApplicationServer} from './server';

async function init() {
  const dbConnection = DBConnection.init(config.get('db'));
  dbConnection.sync();

  const server = new ApplicationServer(config.get('server'));
  server.listen();

}

init()
  .catch(err => {
    logger.error('Something went wrong', err);
    process.exit(1);
  });
