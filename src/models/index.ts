import {Sequelize} from 'sequelize';
import {PoliceInit} from './Police';
import {CaseInit} from './Case';
import {TDBConfiguration} from './configuration';
import {ModelInit} from '@models/model-init';

let dbConnection: DBConnection = null;

export class DBConnection {
  sequelize: Sequelize;

  private constructor(config: TDBConfiguration) {
    const {database, username, password, options} = config;
    this.sequelize = new Sequelize(database, username, password, options);

    this.createModels();
  }

  static init(config: TDBConfiguration): DBConnection {
    if (!dbConnection) {
      dbConnection = new DBConnection(config);
    }
    return dbConnection;
  }

  static getInstance(): DBConnection {
    return dbConnection;
  }

  private createModels() {
    const models = [
      new PoliceInit(this.sequelize),
      new CaseInit(this.sequelize)
    ];

    models.forEach((inst: ModelInit) => {
      inst.build();
    });

    models.forEach(inst => {
      inst.associate();
    });
  }

  async closeDatabase() {
    await this.sequelize.close();
    dbConnection = null;
  }

  sync() {
    this.sequelize.sync({force: false});
  }
}
