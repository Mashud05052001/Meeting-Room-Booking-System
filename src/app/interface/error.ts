export type TErrorSources = {
  path: string;
  message: string;
}[];

export type TError = {
  success: false;
  statusCode: number;
  message: string;
  errorMessages?: TErrorSources;
  stack?: string;
};
