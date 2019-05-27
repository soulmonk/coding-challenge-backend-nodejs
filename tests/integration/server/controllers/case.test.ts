import {Case, TBikeType} from '@models/Case';
import {Police} from '@models/Police';
import {dbConnection, loadSeeds} from '@tests/integration/server/database-utils';
import {server} from '@tests/integration/server/server-utils';
import {expect} from 'chai';
import {join} from 'path';
import {Response} from 'superagent';
import {globalHooks} from '../global-hooks';

function buildSearchCase(filterName: string, query: object, expectedLength: number, expected?: (res: Response) => void) {
  it(`should filter by ${filterName}`, async () => {
    const res = await server
      .get('/api/case')
      .query(query)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('length', expectedLength);
    if (expected) {
      expected(res);
    }
  });
}

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
      expect(res.body.data).to.have.property('length', 9);
    });

    it('should validate request', async () => {
      const res = await server
        .get('/api/case')
        .query({resolved: 'boolean'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).to.have.property('error');
    });

    it('should validate unsupported type', async () => {
      const res = await server
        .get('/api/case')
        .query({type: 'Unknown bike type'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).to.have.property('error');
    });

    describe('search', () => {
      it('should filter by name', async () => {
        /*
        type: Joi.string().valid(BikeTypes),
  ownerName: Joi.string(),
  color: Joi.string(),
  policeId: Joi.number(),
  resolved: Joi.boolean(),
  */
        const res = await server
          .get('/api/case')
          .query({ownerName: 'owner1'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('length', 1);
      });

      buildSearchCase('owner name', {ownerName: 'owner1'}, 1);
      buildSearchCase('owner name, partial', {ownerName: 'John'}, 2);
      buildSearchCase('type', {type: 'TimeTrial'}, 0);
      buildSearchCase('unassigned', {policeId: ''}, 6);
      buildSearchCase('by police officer id', {policeId: 2}, 1, res => {
        expect(res.body.data[0]).to.have.property('policeOfficerName', 'test2');
      });
      buildSearchCase('owner name and type', {ownerName: 'John', type: 'Road'}, 1);
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
        date: new Date().toString(),
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
        'date',

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
        date: new Date(),
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
