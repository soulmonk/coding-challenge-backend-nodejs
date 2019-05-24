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

    it('should return list', async () => {
      await Police.create({fullName: 'test1'});
      await Police.create({fullName: 'test2'});

      const res = await server
        .get('/api/police')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('length', 2);
      expect(res.body.data).to.have.deep.equal([
        {
          id: 1,
          fullName: 'test1',
          caseId: null
        },
        {
          id: 2,
          fullName: 'test2',
          caseId: null
        }
      ]);
    });

    it('should return list with case', async () => {
      const police = await Police.create({fullName: 'test1'});
      await Police.create({fullName: 'test2'});
      const case1 = await Case.create({ownerName: 'test1', type: TBikeType.Commuting});
      await police.setCase(case1);

      const res = await server
        .get('/api/police')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('length', 2);
      expect(res.body.data).to.have.deep.equal([
        {
          id: 1,
          fullName: 'test1',
          caseId: 1
        },
        {
          id: 2,
          fullName: 'test2',
          caseId: null
        }
      ]);
    });

    it('should not be created without name', async () => {
      const res = await server
        .post('/api/police')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).to.have.property('data');
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
      const case1 = await Case.create({ownerName: 'test1', type: TBikeType.Commuting});
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
      expect(res.body.data).to.have.property('caseId', case1.id);
    });
  });

  describe('fire', async () => {

    afterEach(async () => {
      await dbConnection.sync({force: true});
    });

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
