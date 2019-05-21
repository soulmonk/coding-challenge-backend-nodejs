import {Model, Sequelize} from 'sequelize';

export class BaseModel extends Model {
  static associate(): void {}

  static Init(sequelize: Sequelize): void {
    throw new Error('Not implemented');
  }
}
