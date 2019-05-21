import {TDBConfiguration} from '@models/configuration';
import {TServerConfiguration} from '../server/configuration';

export type TConfiguration = {
  server: TServerConfiguration
  db: TDBConfiguration
}
