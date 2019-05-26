import {Association, BelongsToGetAssociationMixin, DataTypes, Model, Sequelize} from 'sequelize';
import {IModelInitialization} from './model-initialization';
import {Police} from './Police';

// TODO split files: entity, model, initialization

export enum TBikeType {
  Mountain = 'Mountain',
  Hybrid = 'Hybrid', // Comfort
  Road = 'Road',
  TimeTrial = 'TimeTrial', // Triathlon
  BMX = 'BMX', // Trick
  Commuting = 'Commuting',
  Cyclocross = 'Cyclocross',
  Track = 'Track', // Fixed Gear
  Tandem = 'Tandem',
  Folding = 'Folding',
  Kids = 'Kids',
  BeachCruiser = 'BeachCruiser',
  Recumbent = 'Recumbent',
}

export interface ICase {
  id: number;
  policeId?: number;
  type: TBikeType;
  ownerName: string;
  licenseNumber: string;
  policeOfficerName?: string;
  color: string;
  theftDescription: string;
}

export class Case extends Model implements ICase {
  public static associations: {
    police: Association<Case, Police>;
  };

  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public ownerName: string;
  public licenseNumber: string;
  public color: string;
  public theftDescription: string;

  public policeId!: number;
  public policeOfficerName?: string; // -> police.fullName

  public type: TBikeType;

  // timestamps! // do we need ?
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // these will not exist until `Model.init` was called.
  public getPolice!: BelongsToGetAssociationMixin<Police>; // Note the null assertions!

  public readonly police!: Police;
}

export const initialization: IModelInitialization = {
  associate(): void {
    Case.belongsTo(Police, {
      foreignKey: {
        name: 'policeId',
        allowNull: true
      }
    });
  },
  initialize(sequelize: Sequelize) {
    const attributes = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.ENUM('Mountain',
          'Hybrid',
          'Road',
          'TimeTrial',
          'BMX',
          'Commuting',
          'Cyclocross',
          'Track',
          'Tandem',
          'Folding',
          'Kids',
          'BeachCruiser',
          'Recumbent'),
        require: true
      },
      ownerName: {
        type: DataTypes.STRING,
        require: true,
      },
      licenseNumber: {
        type: DataTypes.STRING,
        require: true,
      },
      color: {
        type: DataTypes.STRING,
        require: true,
      },
      theftDescription: {
        type: DataTypes.TEXT,
        require: true,
      }
    };

    const options = {
      tableName: 'cases',
      sequelize
    };

    Case.init(attributes, options);
  }
};
