import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasOneGetAssociationMixin,
  Sequelize
} from 'sequelize';

import {BaseModel} from './base-model';
import {Police} from './Police';

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
}

export class Case extends BaseModel implements ICase {
  public static associations: {
    police: Association<Case, Police>;
  };

  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public policeId?: number;

  public type: TBikeType;

  // timestamps! // do we need ?
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // these will not exist until `Model.init` was called.
  public getPolice!: BelongsToGetAssociationMixin<Police>; // Note the null assertions!

  public static associate(): void {
    Case.belongsTo(Police, {
      foreignKey: {
        name: 'policeId',
        allowNull: true
      }
    });
  }

  public static initialize(sequelize: Sequelize) {
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
          'Recumbent')
      }
    };

    const options = {
      tableName: 'cases',
      sequelize
    };

    Case.init(attributes, options);

    // todo tests maybe associate can be here, not after all init

  }

  // todo move to service
  toPublic() {
    return {
      id: this.id,
      type: this.type
    };
  }
}
