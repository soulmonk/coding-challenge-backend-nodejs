import {Case, TBikeType} from '@models/Case';
import {Police} from '@models/Police';
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
      const policeOfficer = await Police.create({fullName: 'test1'});

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

      expect(record.id).to.be.equal(1);
      expect(record.policeOfficerName).to.be.equal(policeOfficer.fullName);
    });

  });

  describe('#resolve', () => {
    afterEach(async () => {
      await dbConnection.sync({force: true});
    });

    it('should resolve case', async () => {
      const policeOfficer = await Police.create({fullName: 'test1'});
      const caseModel = await Case.create({
        ownerName: 'John Doe',
        licenseNumber: '123abc456',
        color: 'black',
        type: TBikeType.Mountain,
        theftDescription: 'Some description'
      });

      await policeOfficer.setCase(caseModel);

      const res = await server
        .put('/api/case/' + caseModel.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');
      const record = res.body.data;

      expect(record.id).to.be.equal(caseModel.id);
      expect(record.policeOfficerName).to.be.null;
      expect(record.resolved).to.be.true;
    });

    it('should not allow resolve unassigned case', async () => {
      const caseModel = await Case.create({
        ownerName: 'John Doe',
        licenseNumber: '123abc456',
        color: 'black',
        type: TBikeType.Mountain,
        theftDescription: 'Some description'
      });

      const res = await server
        .put('/api/case/' + caseModel.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).to.have.property('error', 'Could not resolve case without police officer');
    });

    it('should auto-assign case', async () => {
      const policeOfficer = await Police.create({fullName: 'test1'});
      const caseModel = await Case.create({
        ownerName: 'John Doe',
        licenseNumber: '123abc456',
        color: 'black',
        type: TBikeType.Mountain,
        theftDescription: 'Some description'
      });

      const unassignedCase = await Case.create({
        ownerName: 'John Doe 2',
        licenseNumber: '654cba321',
        color: 'black',
        type: TBikeType.BMX,
        theftDescription: 'Some description 2'
      });

      await policeOfficer.setCase(caseModel);

      const res = await server
        .put('/api/case/' + caseModel.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.have.property('data');

      const assignedCase = await Case.findByPk(unassignedCase.id, {include: [Case.associations.police]});
      expect(assignedCase.police).to.have.property('id', policeOfficer.id);
    });
  });
});
