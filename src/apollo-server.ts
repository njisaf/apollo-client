import {
    ApolloServer
} from "apollo-server-lambda";
// import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import {
    resolvers
} from "./resolvers";
import {
    typeDefs
} from "./type-defs";

import EstablishmentsDB from "./datasources/establishmentsDB";

const establishmentPath = "/establishment";

const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({
        event,
        context
    }) => {
        console.log("serverless event: ", event);
        console.log("serverless context: ", context);
        return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            context,
        };
    },
    dataSources: () => {
        return {
            establishmentsDB: new EstablishmentsDB(),
        };
    },
    introspection: true,
});

const apolloHandler = apolloServer.createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: "*",
            credentials: true,
        },
    },
});

export const graphqlHandler = (event: any, context: any, callback: any) => {
    console.log("Request event", event);
    console.log("Request context: ", context);
    let resBody, variables;
    switch (true) {
        case event.httpMethod === "GET" && event.path === establishmentPath:
            const query = `
                query GetEstablishment($getEstablishmentId: String!) {
                    getEstablishment(id: $getEstablishmentId) {
                        id
                        name
                    }
                }
                `;
            variables = {
                getEstablishmentId: event.queryStringParameters.id,
            };
            resBody = JSON.stringify({
                query,
                variables,
            });
            break;
        case event.httpMethod === "POST" && event.path === establishmentPath:
            const mutation = `
                mutation CreateEstablishment($createEstablishmentId: String!, $name: String!) {
                    createEstablishment(id: $createEstablishmentId, name: $name) {
                        id
                        name
                    }
                }`;
            const body = JSON.parse(event.body);
            variables = {
                createEstablishmentId: body.id,
                name: body.name,
            };
            resBody = JSON.stringify({
                query: mutation,
                variables,
            });
            break;
        default:
            break;
    };

    const newEvent = Object.assign(event, {
        body: resBody,
        requestContext: context,
        resource: "/graphql",
        path: "/graphql",
        httpMethod: "POST",
        headers: {
            "Accept": "*/*",
            "content-type": "application/json",
        },
    });

    return apolloHandler(newEvent, context, callback);
};