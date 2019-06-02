import {Sequelize, SyncOptions} from 'sequelize';
import {initialization as CaseInit} from './Case';
import {TDBConfiguration} from './configuration';
import {IModelInitialization} from './model-initialization';
import {initialization as OfficerInit} from './Officer';

let dbConnection: DBConnection = null;

// todo remove sequelize, why ?

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
      OfficerInit,
      CaseInit
    ];

    models.forEach((inst: IModelInitialization) => {
      inst.initialize(this.sequelize);
    });

    models.forEach((inst: IModelInitialization) => {
      inst.associate();
    });
  }
}
