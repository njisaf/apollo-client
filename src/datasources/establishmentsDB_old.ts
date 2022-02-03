import { DynamoDBDataSource } from "apollo-datasource-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

type Establishment = {
    id: number,
    name: string
}

const tableName = "establishments";
const tableKeySchema: DocumentClient.KeySchema = [
    {
        AttributeName: "id",
        KeyType: "HASH",
    },
];

class EstablishmentsDB extends DynamoDBDataSource<Establishment> {

  private readonly ttl = 30 * 60; // 30minutes

  constructor(client?: DocumentClient) {
    super(tableName, tableKeySchema, undefined, client);
  }

  async getEstablishment(id: string): Promise<Establishment> {
    const getItemInput: DocumentClient.GetItemInput = {
      TableName: tableName,
      ConsistentRead: true,
      Key: { id },
    };
    return this.getItem(getItemInput, this.ttl);
  }

  async getAllEstablishments(): Promise<Establishment[]> {
    const scanInput: DocumentClient.ScanInput = {
      TableName: tableName,
      ConsistentRead: true,
    };
    return this.scan(scanInput, this.ttl);
  }

  async createEstablishment(id: number, name: string): Promise<Establishment> {
      const newEstablishment: Establishment = {
        id,
        name
      };
      return await this.put(newEstablishment, this.ttl);
  }
}

export default EstablishmentsDB;
