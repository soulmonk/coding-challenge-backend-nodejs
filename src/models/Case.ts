import {logger} from '@services/logger';
import {Association, DataTypes, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Sequelize} from 'sequelize';

import {BaseModel} from './base-model';
import {Police} from './Police';

export enum TBikeType {
  Mountain = 1,
  Hybrid, // Comfort
  Road,
  TimeTrial, // Triathlon
  BMX, // Trick
  Commuting,
  Cyclocross,
  Track, // Fixed Gear
  Tandem,
  Folding,
  Kids,
  BeachCruiser,
  Recumbent
}

export class Case extends BaseModel {
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
  public getPolice!: HasOneGetAssociationMixin<Police>; // Note the null assertions!
  public setPolice!: HasOneSetAssociationMixin<Police, 'id'>;

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
