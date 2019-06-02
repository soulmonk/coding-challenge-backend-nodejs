/**
 * This file merges all of the schemas that belong to different parts of the shards
 */
import {mergeRawSchemas} from '../utils/mergeRawSchemas';
import cases from './case';
import officers from './officer';

export default mergeRawSchemas(
  officers,
  cases
);
