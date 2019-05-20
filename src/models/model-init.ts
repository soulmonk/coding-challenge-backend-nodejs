import {Sequelize} from 'sequelize';

export class ModelInit {
  sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }
  associate() {};

  build() {
    throw new Error('Abstract');
  }
}
