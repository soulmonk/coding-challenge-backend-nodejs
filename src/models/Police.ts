import {Association, DataTypes, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Sequelize} from 'sequelize';
import {BaseModel} from './base-model';
import {Case} from './Case';

export interface IPolice {
  id: number;
  fullName: string;
}

export class Police extends BaseModel implements IPolice {
  public static associations: {
    case: Association<Police, Case>;
  };

  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public fullName!: string;

  public getCase!: HasOneGetAssociationMixin<Case>; // Note the null assertions!
  public setCase!: HasOneSetAssociationMixin<Case, 'id'>;

  // actively include a relation.
  public readonly case?: Case; // Note this is optional since it's only populated when explicitly requested in code

  public static associate(): void {
    Police.hasOne(Case, {
      foreignKey: {
        name: 'policeId',
        allowNull: true
      },
      as: 'case'
    });
  }

  static initialize(sequelize: Sequelize) {
    const attributes = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fullName: {
        type: DataTypes.STRING(255)
      }
    };

    const options = {
      tableName: 'polices',
      sequelize,
      timestamps: false
    };

    Police.init(attributes, options);

    // todo tests maybe associate can be here, not after all init

  }
}
