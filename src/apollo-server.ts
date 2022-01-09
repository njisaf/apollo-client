
import { ApolloServer } from 'apollo-server-lambda';


import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

import MoviesAPI from './moviesAPI';
import ImdbAPI from './imdbAPI';

const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    // context: ({req}) => {
        
    // },
    dataSources: () => {
        return {
            moviesAPI: new MoviesAPI(),
            imdbAPI: new ImdbAPI()
        }
    }
});

export const graphqlHandler = apolloServer.createHandler();