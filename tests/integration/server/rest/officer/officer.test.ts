import {Case, TBikeType} from '@models/Case';
import {Officer} from '@models/Officer';
import {expect} from 'chai';
import {schemaMigration} from '../../database-utils';
import {server} from '../../server-utils';

describe('Officer api', () => {
  before(async () => {
    await schemaMigration();
  });

  describe('hire', async () => {

    afterEach(async () => {
      await schemaMigration();
    });

    it('should return list', async () => {
      await Officer.create({fullName: 'test1'});
      await Officer.create({fullName: 'test2'});

      const res = await server
        .get('/api/officer')
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
      const officer = await Officer.create({fullName: 'test1'});
      await Officer.create({fullName: 'test2'});
      const case1 = await Case.create({ownerName: 'test1', type: TBikeType.Commuting});
      await officer.setCase(case1);

      const res = await server
        .get('/api/officer')
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
        .post('/api/officer')
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
        .post('/api/officer')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');

      const record = res.body.data;
      const officerProperties = [
        'id',
        'fullName',
        'caseId'
      ];
      expect(record).to.have.all.keys(officerProperties);
      expect(record.id).to.be.equal(1);
    });

    it('should auto-assign case', async () => {
      const case1 = await Case.create({ownerName: 'test1', type: TBikeType.Commuting});
      const data = {
        fullName: 'test'
      };

      const res = await server
        .post('/api/officer')
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
      await schemaMigration();
    });

    it('should remove police officer record', async () => {
      const officer = await Officer.create({fullName: 'test1'});

      await server
        .delete('/api/officer/' + officer.id)
        .set('Accept', 'application/json')
        .expect(204);

      const removedRecord = await Officer.findByPk(officer.id);
      expect(removedRecord).to.be.null;
    });

    it('should return 404 if no record', async () => {
      const res = await server
        .delete('/api/officer/10000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).to.have.property('error', 'Not found');
    });

    it('should not allow not string id', async () => {
      const officer = await Officer.create({fullName: 'test1'});

      const res = await server
        .delete('/api/officer/some_id' + officer.id)
        .set('Accept', 'application/json')
        .expect(400);

      const removedRecord = await Officer.findByPk(officer.id);
      expect(removedRecord).to.be.not.null;
      expect(removedRecord.id).to.be.equal(officer.id);

      expect(res.body).to.have.property('error');
      // todo contain validation error
    });

    it('should not remove police officer record if one is assign with case', async () => {
      const officer = await Officer.create({fullName: 'test1'});
      const case1 = await Case.create({ownerName: 'test1', type: TBikeType.Commuting});
      await officer.setCase(case1);

      const res = await server
        .delete('/api/officer/' + officer.id)
        .set('Accept', 'application/json')
        .expect(400);

      const removedRecord = await Officer.findByPk(officer.id);
      expect(removedRecord).to.be.not.null;
      expect(removedRecord.id).to.be.equal(officer.id);

      expect(res.body).to.have.property('error', 'Police officer has a case: ' + case1.id);
    });
  });

});
