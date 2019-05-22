import {globalHooks} from '@tests/integration/server/global-hooks';
import {testServer} from '@tests/integration/server/server-utils';
import {expect} from 'chai';
import * as request from 'supertest';

describe('health api', () => {
  globalHooks();

  it('should return 200 ok', async () => {
    const res: request.Response = await request(testServer)
      .get('/live')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).to.have.property('success', true);
  });
});
