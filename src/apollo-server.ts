
import { ApolloServer } from 'apollo-server-lambda';
// import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

import EstablishmentsDB from './datasources/establishmentsDB';

// const client: DocumentClient = new DocumentClient({
//     apiVersion: 'latest',
//     region: 'us-east-1',
// });


const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({event, context}) => {
        console.log('serverless event: ', event);
        console.log('serverless context: ', context);
        return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            context
        }
    },
    dataSources: () => {
        return {
            establishmentsDB: new EstablishmentsDB()
        }
    },
    introspection: true,
});

export const graphqlHandler = apolloServer.createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: '*',
            credentials: true,
        },
    },
});