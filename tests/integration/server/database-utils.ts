import {TDBConfiguration} from '@models/configuration';
import {DBConnection} from '@models/index';
import * as config from 'config';
import {readFileSync} from 'fs';
import {QueryTypes} from 'sequelize';

const testDBConfig: TDBConfiguration = config.get('db');

export const dbConnection = DBConnection.init(testDBConfig);

export function schemaMigration() {
  return dbConnection.sync({force: true});
}

export function loadSeeds(path: string) {
  const query = readFileSync(path, 'utf8');
  return dbConnection.sequelize.query(query, {raw: true, type: QueryTypes.INSERT});
}

/*
import {createLogger, format, transports} from 'winston';

const {printf, combine, timestamp, label} = format;

// -----

const myFormat = printf(info => {
  return `${info.timestamp} ${info.label}: ${info.message}`;
});

const logger = createLogger({
  transports: new transports.Console({
    format: combine(
      label({label: 'DB'}),
      timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      myFormat
    ),
    level: 'debug'
  })
});

const testDBConfiguration = Object.assign(
  {},
  config.get('db'),
  {
    logging: logger.debug as (...props: any) => void
  });

export const dbConnection = DBConnection.init(testDBConfiguration as TDBConfiguration);

 */
