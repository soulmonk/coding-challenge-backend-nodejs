import {DBConnection, IDBConfig} from './db';

export interface ApplicationConfig {
  port: number,
  db: IDBConfig
}

export class Application {
  public dbConnection: DBConnection;
  public config: ApplicationConfig;

  constructor(config: ApplicationConfig, dbConnection: DBConnection) {
    this.dbConnection = dbConnection;
    this.config = config;
  }

  listen(port) {
    // todo is needed ?
  }
}

export const createApplication = () => {

  // todo move db ini here from src/index.ts

  // TODO config from file
  const config: ApplicationConfig = {
    port: 7430,
    db: {
      'database': 'challenge',
      'username': 'postgres',
      'password': 'root',
      'options': {
        'host': '127.0.0.1',
        'dialect': 'postgres'
      }
    }
  };

  const dbConnection = new DBConnection(config.db);
  const application = new Application(ApplicationConfig, dbConnection);
  return application;
};
