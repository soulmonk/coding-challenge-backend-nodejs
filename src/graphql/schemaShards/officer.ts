import {IOfficer} from '@models/Officer';
import {OfficerService} from '@services/officer';
import {gql} from 'apollo-server-koa';
import {pubsub} from '../subscriptionManager';

const typeDefs = gql`
  extend type Query {
    " get all officers "
    getOfficers: [Officer]
  }

  extend type Mutation {
    " create a new officer "
    createOfficer(input: InputCreateOfficer!): Officer
  }

  
  extend type Subscription {
    " called when a new officer is created "
    officerCreated: Officer
  }

  " input to create a new officer "
  input InputCreateOfficer {
    fullName: String
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
        console.log('a');
        const post = await OfficerService.create(input as IOfficer);
        // publish the post to the subscribers
        pubsub.publish('officerCreated', {
          officerCreated: post
        });
        return post;
      }
    },
    Subscription: {
      officerCreated: {
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
