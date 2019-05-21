import {DataTypes, Model, Sequelize} from 'sequelize';
import {BaseModel} from './base-model';

export class Case extends BaseModel  {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static Init(sequelize: Sequelize) {
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

    // todo test maybe associate can be here, not after all init

  }
}
