import { gql } from "apollo-server-lambda";

// {
//   "establishments": [
    // {
    //   "dba_name": "Est1",
    //   "legal_name": "Est1",
    //   "addresses": [
    //     {
    //       "address_id": 1,
    //       "address_type": "office",
    //       "address_state": "VA"
    //     },
    //     {
    //       "address_id": 2,
    //       "address_type": "physical location",
    //       "address_state": "VA"
    //     }
    //   ]
    // }
//   ]
// }

export const typeDefs = gql`
  type Address {
    address_id: Int!,
    address_type: String!,
    address_state: String!
  }
  input AddressInput {
    address_id: Int!,
    address_type: String!,
    address_state: String!
  }
  type Establishment {
    dba_name: String!,
    legal_name: String!,
    addresses: [Address]
  }
  input EstablishmentInput {
    dba_name: String!,
    legal_name: String!,
    addresses: [AddressInput]
  }
  scalar Json
  type Query {
    testMessage: String!,
    getEstablishment(dba_name: String!): Establishment,
    getEstablishments: [Establishment],
  }
  type Mutation {
    createEstablishment(establishment: EstablishmentInput): Establishment
  }
`;
