import {dbConnection} from '@tests/integration/server/database-utils';
import {server} from '@tests/integration/server/server-utils';
import {expect} from 'chai';
import {globalHooks} from '../global-hooks';

describe('Police api', () => {
  globalHooks();

  describe('hire', async () => {

    afterEach(async () => {
      await dbConnection.sync({force: true});
    });

    describe('validation', () => {
      it('should not be created without name', async () => {
        throw new Error('Not implemented');
      });
    });

    it('should create police officer record', async () => {
      const data = {
        fullName: 'test'
      };

      const res = await server
        .post('/api/police')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');

      const record = res.body.data;
      const policeProperties = [
        'id',
        'fullName',
        'caseId'
      ];
      expect(record).to.have.all.keys(policeProperties);
      expect(record.id).to.be.equal(1);
    });

    it('should auto-assign case', async () => {
      throw new Error('Not implemented');
    });
  });

  describe('fire', async () => {
    it('should remove police officer record', async () => {
      throw new Error('Not implemented');
    });

    it('should not remove police officer record if one is assign with case', async () => {
      throw new Error('Not implemented');
    });
  });

});
