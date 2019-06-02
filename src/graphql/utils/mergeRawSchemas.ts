import {IExecutableSchemaDefinition} from 'apollo-server-koa';
import {isArray, mergeWith} from 'lodash';

function withArraysConcatenation(objValue: any, srcValue: any) {
  // if an array, concat it
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  // use the normal lodash merge functionality
}

// allows us to merge schemas
export const mergeRawSchemas = (...schemas: IExecutableSchemaDefinition[]):
  IExecutableSchemaDefinition => {
  return mergeWith({}, ...schemas, withArraysConcatenation);
};
