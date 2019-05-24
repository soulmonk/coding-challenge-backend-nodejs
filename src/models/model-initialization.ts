import {Sequelize} from 'sequelize';

export interface IModelInitialization {
  associate(): void;
  initialize(sequelize: Sequelize): void;
}
