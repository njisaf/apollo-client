import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

const basePath = "l94gia19j0.execute-api.us-east-1.amazonaws.com/prod";

class EstablishmentDB extends RESTDataSource {
  constructor() {
    // Always call super()
    super();
    // Sets the base URL for the REST API
    this.baseURL = `https://${basePath}/`;
  }
  willSendRequest(request: RequestOptions) {
    request.headers.set(
      "Accept",
      "*/*"
    );
    request.headers.set(
      "content-type",
      "application/json"
    );
  }

  async getEstablishment(dba_name: string) {
    console.log('dba_name: ', dba_name);
    return await this.get(`establishment?dba_name=${encodeURIComponent(dba_name)}`);
  }

  async createEstablishment(establishment: any) {
    console.log('establishment: ', establishment);
      const postRes = await this.post(
          "establishment",
          establishment
        )
    console.log('postRes: ', postRes);
    return postRes.Item;
  }
}

export default EstablishmentDB;
