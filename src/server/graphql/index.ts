import {ApolloServer, Config, makeExecutableSchema} from 'apollo-server-koa';
import Koa = require('koa');
import {rawSchema} from '../../graphql';
import {handleGraphQLContext, handleGraphQLSubscriptionContext} from './context-handler';

export const GraphqlServer = (app: Koa) => {

  // create our schema
  const schema = makeExecutableSchema(rawSchema);

  // configure the server here
  const options: Config = {
    schema,
    context: handleGraphQLContext,
    subscriptions: {
      onConnect: handleGraphQLSubscriptionContext
    },
    playground: {}
  };

  const apolloServer = new ApolloServer(options);

  apolloServer.applyMiddleware({app});
};
