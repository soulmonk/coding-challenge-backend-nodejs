import {DBConnection} from '@models/index';
import {TDBConfiguration} from '@models/configuration';

const testDBConfig: TDBConfiguration = {
  'database': 'challenge',
  'username': 'postgres',
  'password': 'root',
  'options': {
    'host': '127.0.0.1',
    'dialect': 'postgres',
    // 'operatorsAliases': false
  }
};

export const dbConnection = DBConnection.init(testDBConfig);

export function schemaMigration() {
  return dbConnection.sync()
}
