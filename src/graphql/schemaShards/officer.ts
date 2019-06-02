import {IOfficer} from '@models/Officer';
import {OfficerService} from '@services/officer';
import {gql} from 'apollo-server-koa';
import {pubsub} from '../subscriptionManager';

const typeDefs = gql`
  extend type Query {
    " get all posts "
    getOfficers: [Officer]
  }

  extend type Mutation {
    " create a new post "
    createOfficer(input: InputCreateOfficer!): Officer
  }

  extend type Subscription {
    " called when a new post is created "
    officerCreated: Officer
  }

  " input to create a new post "
  input InputCreateOfficer {
    text: String
  }

  type Officer {
    id: ID
    fullName: String
  }
`;

export default {
  resolvers: {
    Query: {
      // get a user
      getOfficers: () => OfficerService.list()
    },
    Mutation: {
      // create a post
      createOfficer: async (root: any, {input}: GQL.MutationToCreateOfficerArgs, context: any) => {
        // create a new post in the database
        const post = await OfficerService.create(input as IOfficer);
        // publish the post to the subscribers
        pubsub.publish('officerCreated', {
          officerCreated: post
        });
        return post;
      }
    },
    Subscription: {
      caseCreated: {
        subscribe: (root: any, args: any, context: any) => {
          return pubsub.asyncIterator('officerCreated');
        }
      }
    },
    Officer: {
      // user: (post: Partial<GQL.Post>) => getPublicUser(post.userId)
    }
  },
  typeDefs: [typeDefs]
};
