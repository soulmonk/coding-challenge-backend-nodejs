import {Options} from 'sequelize';

// tslint:disable-next-line:interface-over-type-literal
export type TDBConfiguration = {
  database: string;
  username: string;
  password: string;
  options: Options;
};
