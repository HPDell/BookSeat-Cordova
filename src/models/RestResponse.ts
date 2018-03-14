export interface RestResponse<T> {
  status?: String;
  data?: T,
  code?: String;
  message?: String;
}