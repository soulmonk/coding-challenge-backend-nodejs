import {logger} from '@services/logger';
import {dbConnection, schemaMigration} from './database-utils';

export function globalHooks() {
  before(async function() {
    this.timeout(5000);
    logger.info('Initializing database migration.');
    await schemaMigration();
  });

  after(async () => {
    const shutdowns = [dbConnection.closeDatabase()];
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
}
