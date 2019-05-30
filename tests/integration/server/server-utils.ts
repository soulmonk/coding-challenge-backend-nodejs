import {ApplicationServer} from '@server/index';
import * as config from 'config';
import * as request from 'supertest';

export const appServer: ApplicationServer = new ApplicationServer(config.get('server'));
export const getServer = () => {
  console.log('server-utils.ts::getServer::7 >>>', appServer.server);
  return request(appServer.server);
};
