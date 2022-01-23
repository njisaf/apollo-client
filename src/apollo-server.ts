
import { ApolloServer } from 'apollo-server-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

import EstablishmentsDB from './datasources/establishmentsDB';
// import MoviesAPI from './datasources/moviesAPI';
// import ImdbAPI from './datasources/imdbAPI';

const client: DocumentClient = new DocumentClient({
    apiVersion: 'latest',
    region: 'us-east-1',
});


const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({event, context}) => {
        console.log('event: ', event);
        console.log('context: ', context);
        return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            context
        }
    },
    dataSources: () => {
        return {
            // moviesAPI: new MoviesAPI(),
            // imdbAPI: new ImdbAPI(),
            establishmentsDB: new EstablishmentsDB(client)
        }
    }
});

export const graphqlHandler = apolloServer.createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: '*',
            credentials: true,
        },
    },
});