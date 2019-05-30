import {DBConnection} from '@models/index';
import {logger} from '@services/logger';
import {schemaMigration} from './database-utils';
import {appServer} from './server-utils';

before(async function() {
  this.timeout(5000);
  logger.info('Initializing database migration.');
  await schemaMigration();
});

after(async () => {
  const shutdowns = [appServer.disconnect(), DBConnection.getInstance().closeDatabase()];
  // do we need clean and restart server?

  logger.info('Start cleaning tests resources.');

  for (const shutdown of shutdowns) {
    try {
      await shutdown;
    } catch (e) {
      logger.error('Error in graceful shutdown ', e);
    }
  }
});
