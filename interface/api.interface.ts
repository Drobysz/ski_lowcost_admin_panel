export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiCollectionResponse<T> {
  data: T[];
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface ApiError {
  message: string;
  status?: number;
  fields?: Record<string, string>;
}
