import {dbConnection} from '@tests/integration/server/database-utils';
import {globalHooks} from '../global-hooks';

describe('Police api', () => {
  globalHooks();

  afterEach(async () => {
    await dbConnection.sync({force: true});
  });

  describe('hire', async () => {

    it('should create police officer record', async () => {
      throw new Error('Not implemented');
    });

    it('should auto-assign case', async () => {
      throw new Error('Not implemented');
    });
  });

  describe('fire', async () => {
    it('should remove police officer record', async () => {
      throw new Error('Not implemented');
    });
    it('should not remove police officer record if one assign with case', async () => {
      throw new Error('Not implemented');
    });
  });

});
