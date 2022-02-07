import {
    ApolloServer
} from "apollo-server-lambda";

import {
    resolvers
} from "./resolvers";
import {
    typeDefs
} from "./type-defs";

import EstablishmentsDB from "./datasources/establishmentsDB";

const paths = {
    graphQL: "/graphql",
    establishment: "/establishment",
};

const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({
        event,
        context
    }) => {
        console.log("server event: ", event);
        console.log("server context: ", context);
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
    
    let resBody, variables, newEvent;
    switch (true) {
        case event.httpMethod === "GET" && event.path === paths.establishment:
            const query = `
                query GetEstablishment($getEstablishmentId: String!) {
                    getEstablishment(dba_name: $getEstablishmentId) {
                        dba_name
                        legal_name
                        addresses {
                            address_id
                            address_type
                            address_state
                        }
                    }
                }
                `;
            variables = {
                getEstablishmentId: event.queryStringParameters.dba_name,
            };
            resBody = JSON.stringify({
                query,
                variables,
            });
            newEvent = Object.assign(event, {
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
            break;
        case event.httpMethod === "POST" && event.path === paths.establishment:
            const mutation = `
                mutation CreateEstablishment($newEstablishment: EstablishmentInput) {
                    createEstablishment(establishment: $newEstablishment) {
                        dba_name
                        legal_name
                        addresses {
                            address_id
                            address_type
                            address_state
                        }
                    }
                }`;
            const body = JSON.parse(event.body);
            variables = {
                newEstablishment: body
            };
            resBody = JSON.stringify({
                query: mutation,
                variables,
            });
            newEvent = Object.assign(event, {
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
            break;
        case event.path === paths.graphQL:
            newEvent = event;
        default:
            break;
    };
    return apolloHandler(newEvent, context, callback);
};