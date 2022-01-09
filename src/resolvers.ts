import { environment } from './environment';
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const getHistory = async () => {
  const params = {
    TableName: "search_history",
  };

  try {
    const results = await client.send(new ScanCommand(params));
    const history: any = [];
    results?.Items?.forEach((item) => {
      history.push(unmarshall(item));
    });
    console.log('history: ', history);
    return history;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const resolvers = {
  Query: {
    testMessage: async (parent: any, args: any, context: any, info: any) => {
      return `${environment.secretMessage}. Your message is ${args.search}`;
    },
    imdb: async (parent: any, args: any, context: any, info: any) => {
      return context.dataSources.imdbAPI.getImdb(args.search);
    },
    moviesdb: async (parent: any, args: any, context: any, info: any) => {
      return context.dataSources.moviesAPI.getMoviesdb(args.search);
    },
    history: async () => {
      return getHistory();
    }
  },
};