import {Case, TBikeType} from '@models/Case';
import {Police} from '@models/Police';
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
        'fullName'
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
      const police = await Police.create({fullName: 'test1'});

      await server
        .delete('/api/police/' + police.id)
        .set('Accept', 'application/json')
        .expect(204);

      const removedRecord = await Police.findByPk(police.id);
      expect(removedRecord).to.be.null;
    });

    it('should return 404 if no record', async () => {
      const res = await server
        .delete('/api/police/10000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).to.have.property('error', 'Not found');
    });

    it('should not remove police officer record if one is assign with case', async () => {
      const police = await Police.create({fullName: 'test1'});
      const case1 = await Case.create({ownerName: 'test1', type: TBikeType.Commuting});
      await police.setCase(case1);

      const res = await server
        .delete('/api/police/' + police.id)
        .set('Accept', 'application/json')
        .expect(400);

      const removedRecord = await Police.findByPk(police.id);
      expect(removedRecord).to.be.not.null;
      expect(removedRecord.id).to.be.equal(police.id);

      expect(res.body).to.have.property('error', 'Police officer has a case: ' + case1.id);
    });
  });

});
