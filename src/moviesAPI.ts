import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import { environment } from './environment';

const basePath = "movie-database-imdb-alternative.p.rapidapi.com"

class MoviesAPI extends RESTDataSource {
  constructor() {
    // Always call super()
    super();
    // Sets the base URL for the REST API
    this.baseURL = `https://${basePath}/`;
  }
  willSendRequest(request: RequestOptions) {
    request.headers.set('x-rapidapi-host', basePath);
    request.headers.set('x-rapidapi-key', environment.apiToken);
  }

  async getMoviesdb(search: string) {
    console.log('search: ', search);
    // Send a GET request to the specified endpoint
    return this.get(`?s=${encodeURIComponent(search)}&r=json&page=1`);
  }
}

export default MoviesAPI;