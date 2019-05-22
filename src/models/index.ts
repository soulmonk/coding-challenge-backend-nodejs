import {Sequelize, SyncOptions} from 'sequelize';
import {BaseModel} from './base-model';
import {Case} from './Case';
import {TDBConfiguration} from './configuration';
import {Police} from './Police';

let dbConnection: DBConnection = null;

export class DBConnection {
  sequelize: Sequelize;

  static init(config: TDBConfiguration): DBConnection {
    if (!dbConnection) {
      dbConnection = new DBConnection(config);
    }
    return dbConnection;
  }

  static getInstance(): DBConnection {
    return dbConnection;
  }

  private constructor(config: TDBConfiguration) {
    const {database, username, password, options} = config;
    this.sequelize = new Sequelize(database, username, password, options);

    this.createModels();
  }

  async closeDatabase() {
    await this.sequelize.close();
    dbConnection = null;
  }

  sync(options?: SyncOptions) {
    return this.sequelize.sync(options);
  }

  private createModels() {
    const models = [
      Police,
      Case
    ];

    models.forEach((inst: typeof BaseModel) => {
      inst.initialize(this.sequelize);
    });

    models.forEach((inst: typeof BaseModel) => {
      inst.associate();
    });
  }
}
