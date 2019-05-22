import {Model, Sequelize} from 'sequelize';

export class BaseModel extends Model {
  public static associate(): void {}

  public static initialize(sequelize: Sequelize): void {
    throw new Error('Not implemented');
  }
}
