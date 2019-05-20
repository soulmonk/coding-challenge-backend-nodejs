import {DataTypes, Model, Sequelize} from 'sequelize';
import {ModelInit} from 'models/model-init';

export class Case extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class CaseInit extends ModelInit {
  build() {
    const attributes = {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      }
    };

    const options = {
      tableName: 'cases',
      sequelize: this.sequelize
    };

    Case.init(attributes, options);

    // todo test maybe associate can be here, not after all init

  }
}
