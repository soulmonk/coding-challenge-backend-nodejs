import {Case} from '@models/Case';
import {dbConnection} from '@tests/integration/server/database-utils';
import {server} from '@tests/integration/server/server-utils';
import {expect} from 'chai';
import {globalHooks} from '../global-hooks';

describe('Case api', () => {
  globalHooks();

  describe('#list', () => {

    afterEach(async () => {
      await dbConnection.sync({force: true});
    });

    it('should return empty list', async () => {
      const res = await server
        .get('/api/case')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('length', 0);
    });

    it('should return all list', async () => {
      await Case.create();
      await Case.create();

      const res = await server
        .get('/api/case')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('length', 2);
    });

    describe('search', () => {

      afterEach(async () => {
        await dbConnection.sync({force: true});
      });

      it('should filter by name', async () => {
        throw new Error('Not implemented');
      });

      it('should filter by ....', async () => {
        throw new Error('Not implemented');
      });
    });
  });

  it('should return case details', async () => {
    const data = {
      ownerName: 'John Doe',
      licenseNumber: '123abc456',
      color: 'black',
      type: 1,
      theftDescription: 'Some description'
    };
  });

  describe('#report a stolen bike', () => {
    afterEach(async () => {
      await dbConnection.sync({force: true});
    });

    it('should create case', async () => {

      const data = {
        ownerName: 'John Doe',
        licenseNumber: '123abc456',
        color: 'black',
        type: 1,
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
