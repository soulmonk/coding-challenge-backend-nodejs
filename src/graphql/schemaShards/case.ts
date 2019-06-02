import {ICase} from '@models/Case';
import {CaseService} from '@services/case';
import {gql} from 'apollo-server-koa';

const typeDefs = gql`
  extend type Query {
    " get a user's public data"
    getCase(id: ID!): Case
  }

  extend type Mutation {
    " register a new user "
    createCase(input: InputCreateCase!): Case
  }

  " used for creating a new user "
  input InputCreateCase {
    type: String!,
    ownerName: String!,
    licenseNumber: String!,
    color: String!,
    # date: Date,
    theftDescription: String!
  }

  " a type defining a case"
  type Case {
    id: ID
    officerId: ID,
    type: String!,
    ownerName: String!,
    licenseNumber: String!,
    color: String!,
    # date: Date,
    theftDescription: String!
  }
`;

export default {
  resolvers: {
    Query: {
      // get a user
      getCase: (root: any, {id}: GQL.QueryToGetCaseArgs) => CaseService.one(parseInt(id, 10))
    },
    Mutation: {
      // register
      createCase: (root: any, {input}: GQL.MutationToCreateCaseArgs) => CaseService.create(input as ICase)
    }
  },
  typeDefs: [typeDefs]
};
