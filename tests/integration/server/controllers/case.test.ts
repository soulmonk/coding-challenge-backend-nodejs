import {TBikeType} from '@models/Case';
import {dbConnection, loadSeeds} from '@tests/integration/server/database-utils';
import {server} from '@tests/integration/server/server-utils';
import {expect} from 'chai';
import {join} from 'path';
import {globalHooks} from '../global-hooks';

describe('Case api', () => {
  globalHooks();

  describe('#list', () => {

    before(async () => {
      // load seeds
      return loadSeeds(join(__dirname, 'case-search.seeds.sql'));
    });

    after(async () => {
      await dbConnection.sync({force: true});
    });

    it('should return list', async () => {
      const res = await server
        .get('/api/case')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('length', 5);
    });

    it('should validate request', async () => {
      throw new Error('Not implemented');
    });

    describe('search', () => {
      it('should filter by name', async () => {
        throw new Error('Not implemented');
      });

      it('should filter by ....', async () => {
        throw new Error('Not implemented');
      });
    });
  });

  describe('#report a stolen bike', () => {
    afterEach(async () => {
      await dbConnection.sync({force: true});
    });

    describe('validation', () => {

      it('should be not valid with empty body', async () => {
        const res = await server
          .post('/api/case')
          .send({})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400);

        expect(res.body).to.have.property('error');
      });

      it('should be not allow additional fields', async () => {
        // todo add possibility to throw on additional fields
        return;
        const data = {
          ownerName: 'John Doe',
          licenseNumber: '123abc456',
          color: 'black',
          type: TBikeType.Mountain,
          theftDescription: 'Some description',
          additionalField: 'some injection'
        };

        const res = await server
          .post('/api/case')
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400);

        expect(res.body).to.have.property('data');
      });

    });

    it('should create case', async () => {

      const data = {
        ownerName: 'John Doe',
        licenseNumber: '123abc456',
        color: 'black',
        type: TBikeType.Mountain,
        theftDescription: 'Some description'
      };

      const res = await server
        .post('/api/case')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');

      const record = res.body.data;
      const caseProperties = [
        'id',
        'ownerName',
        'licenseNumber',
        'policeOfficerName',
        'color',
        'type',
        'resolved',
        'theftDescription',

        'createdAt',
        'updatedAt'
      ];
      expect(record).to.have.all.keys(caseProperties);
      expect(record.id).to.be.equal(1);
    });

    it('should auto-assign case', async () => {
      throw new Error('Not implemented');
    });

  });

  describe('#resolve', () => {
    it('should resolve case', async () => {
      throw new Error('Not implemented');
    });

    it('should auto-assign case', async () => {
      throw new Error('Not implemented');
    });
  });
});
