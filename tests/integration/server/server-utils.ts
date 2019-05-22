import {ApplicationServer} from '@server/index';
import * as config from 'config';

export const appServer: ApplicationServer = new ApplicationServer(config.get('server'));
export const testServer = appServer.listen();
