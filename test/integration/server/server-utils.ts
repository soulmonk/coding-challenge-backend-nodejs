import {ApplicationServer} from '../../../src/server';

export const appServer: ApplicationServer = new ApplicationServer({
  port: 3310
});
export const testServer = appServer.listen();
