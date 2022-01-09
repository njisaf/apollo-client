import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type MovieResult {
    Title: String,
    Year: String,
    imdbId: String,
    Type: String,
    Poster: String
  }
  type ImdbImg {
    id: String,
    url: String,
    height: Int,
    width: Int
  }
  type ImdbRole {
    character: String,
    characterId: String
  }
  type ImdbActor {
    disambiguation: String,
    id: String,
    legacyNameText: String,
    name: String,
    category: String,
    characters: [String],
    endYear: Int,
    episodeCount: Int,
    roles: [ImdbRole],
    startYear: String
  }
  type ImdbResult {
    id: String,
    image: ImdbImg,
    runningTimInMinutes: Int,
    nextEpisode: String,
    numberOfEpisodes: Int,
    seriesEndYear: Int,
    seriesStartYear: Int,
    title: String,
    titleType: String,
    year: Int,
    principals: [ImdbActor]
  }
  type Imdb {
    query: String,
    results: [ImdbResult]
  }
  type Movies {
    Search: [MovieResult],
    totalResults: Int,
    Response: Boolean
  }
  type HistoryObject {
    id: String
    value: String
  }
  scalar Json
  type Query {
    testMessage: String!,
    imdb(search: String): Imdb
    moviesdb(search: String): Movies
    history: [HistoryObject]
  }
`;
