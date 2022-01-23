import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { environment } from '../environment';

const basePath = "imdb8.p.rapidapi.com";

class ImdbAPI extends RESTDataSource {
  constructor() {
    // Always call super()
    super();
    // Sets the base URL for the REST API
    this.baseURL = `https://${basePath}/`;
  }
  willSendRequest(request: RequestOptions) {
    request.headers.set(
      "x-rapidapi-host",
      basePath
    );
    request.headers.set(
      "x-rapidapi-key",
      environment.apiToken
    );
  }

  async getImdb(search: string) {
    console.log("search: ", search);
    // Send a GET request to the specified endpoint
    return this.get(`title/find/?q=${encodeURIComponent(search)}`);
  }
}

export default ImdbAPI;
