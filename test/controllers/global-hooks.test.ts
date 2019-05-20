import {dbConnection, schemaMigration} from './database-utils';
import {appServer, testServer} from './server-utils';

before(async function() {
  this.timeout(5000);
  console.info('Initializing database migration.');
  await schemaMigration();
});

after(async () => {
  const shutdowns = [dbConnection.closeDatabase()];

  console.info('Start cleaning test resources.');

  for (const shutdown of shutdowns) {
    try {
      await shutdown;
    } catch (e) {
      console.error('Error in graceful shutdown ', e);
    }
  }
});
