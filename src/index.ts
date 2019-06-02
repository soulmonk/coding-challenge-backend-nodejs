import {DBConnection} from '@models/index';
import {ApplicationServer} from '@server/index';
import {logger} from '@services/logger';

import config = require('config');

async function init() {
  const dbConnection = DBConnection.init(config.get('db'));
  await dbConnection.sync();

  const server = new ApplicationServer(config.get('server'));
  await server.listen();
}

init()
  .catch(err => {
    logger.error('Something went wrong', err);
    process.exit(1);
  });
