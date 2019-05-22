import {DataTypes, Model, Sequelize} from 'sequelize';
import {BaseModel} from './base-model';

export class Case extends BaseModel  {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    const attributes = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      }
    };

    const options = {
      tableName: 'cases',
      sequelize
    };

    Case.init(attributes, options);

    // todo tests maybe associate can be here, not after all init

  }
}
