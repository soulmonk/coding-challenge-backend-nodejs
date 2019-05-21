import {TDBConfiguration} from '@models/configuration';
import {TServerConfiguration} from '@server/configuration';

// tslint:disable-next-line:interface-over-type-literal
export type TConfiguration = {
  server: TServerConfiguration
  db: TDBConfiguration
};
