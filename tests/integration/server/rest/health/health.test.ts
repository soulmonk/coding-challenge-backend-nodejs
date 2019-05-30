import {expect} from 'chai';
import * as request from 'supertest';
import {server} from '../../server-utils';

describe('health api', () => {

  it('should return 200 ok', async () => {
    const res: request.Response = await server
      .get('/api/live')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).to.have.property('success', true);
  });
});
