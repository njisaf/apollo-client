import { environment } from './environment';

export const resolvers = {
  Query: {
    testMessage: async (parent: any, args: any, context: any, info: any) => {
      return `${environment.secretMessage}. Your message is ${args.search}`;
    },
    getEstablishment: async (parent: any, args: any, context: any, info: any) => {
      console.log('args: ', args);
      return await context.dataSources.establishmentsDB.getEstablishment(args.id);
    },
    getAllEstablishments: async (parent: any, args: any, context: any, info: any) => {
      return await context.dataSources.establishmentsDB.getAllEstablishments();
    },
  },
  Mutation: {
    createEstablishment: async (parent: any, args: any, context: any, info: any) => {
      return await context.dataSources.establishmentsDB.createEstablishment(args.id, args.name);
    }
  }
};