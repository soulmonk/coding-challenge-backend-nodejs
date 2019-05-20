import {ApplicationServer, createServer} from '../../src/server';

export const appServer: ApplicationServer = createServer({
  port: 3310
});
export const testServer = appServer.listen();
