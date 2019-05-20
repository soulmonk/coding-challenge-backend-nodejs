import {Options} from 'sequelize';

export type TDBConfiguration = {
  database: string;
  username: string;
  password: string;
  options: Options;
}
