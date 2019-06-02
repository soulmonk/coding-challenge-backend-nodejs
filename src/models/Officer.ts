import {Association, DataTypes, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model, Sequelize} from 'sequelize';
import {Case} from './Case';
import {IModelInitialization} from './model-initialization';

export interface IOfficer {
  id: number;
  fullName: string;
  readonly case?: Case;
  caseId?: number;
}

export class Officer extends Model implements IOfficer {
  public static associations: {
    case: Association<Officer, Case>;
  };

  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public fullName!: string;

  public getCase!: HasOneGetAssociationMixin<Case>; // Note the null assertions!
  public setCase!: HasOneSetAssociationMixin<Case, 'id'>;

  public caseId?: number;
  // actively include a relation.
  public readonly case?: Case; // Note this is optional since it's only populated when explicitly requested in code
}

export const initialization: IModelInitialization = {
  associate(): void {
    Officer.hasOne(Case, {
      foreignKey: {
        name: 'officerId',
        allowNull: true
      },
      as: 'case'
    });
  },
  initialize(sequelize: Sequelize) {
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
      tableName: 'officers',
      sequelize,
      timestamps: false
    };

    Officer.init(attributes, options);
  }
};
