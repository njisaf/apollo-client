export const resolvers = {
  Query: {
    getEstablishment: async (parent: any, args: any, context: any, info: any) => {
      console.log('args: ', args);
      return await context.dataSources.establishmentsDB.getEstablishment(args.dba_name);
    },
    getEstablishments: async (parent: any, args: any, context: any, info: any) => {
      return await context.dataSources.establishmentsDB.getEstablishments();
    },
  },
  Mutation: {
    createEstablishment: async (parent: any, args: any, context: any, info: any) => {
      console.log('args: ', args);
      return await context.dataSources.establishmentsDB.createEstablishment(args.establishment);
    }
  }
};