import {ApplicationServer} from '@server/index';
import * as config from 'config';
import request = require('supertest');

export const appServer: ApplicationServer = new ApplicationServer(config.get('server'));
export const testServerInstance = appServer.listen();
export const server = request(testServerInstance);
