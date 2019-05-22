import {TDBConfiguration} from '@models/configuration';
import {DBConnection} from '@models/index';
import * as config from 'config';

const testDBConfig: TDBConfiguration = config.get('db');

export const dbConnection = DBConnection.init(testDBConfig);

export function schemaMigration() {
  return dbConnection.sync({force: true});
}

export function addSeeds() {
  throw new Error('Not implemented');
}
