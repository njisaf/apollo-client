import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { environment } from '../environment';

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

  async getEstablishment(id: string) {
      console.log('id: ', id);
    return await this.get(`establishment?id=${encodeURIComponent(id)}`);
  }

  async createEstablishment(id: string, name: string) {
      const postRes = await this.post(
          "establishment",
          {
              id,
              name
            }
        )
    console.log('postRes: ', postRes);
    return postRes.Item;
  }
}

export default EstablishmentDB;
