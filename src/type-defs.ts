import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Establishment {
    id: String!,
    name: String!
  }
  scalar Json
  type Query {
    testMessage: String!,
    getEstablishment(id: String!): Establishment,
    getAllEstablishments: [Establishment],
  }
  type Mutation {
    createEstablishment(id: String!, name: String!): Establishment
  }
`;
