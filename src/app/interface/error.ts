export type TErrorMessages = {
  path: string;
  message: string;
}[];

export type TError = {
  success: false;
  statusCode: number;
  message: string;
  errorMessages?: TErrorMessages;
  stack?: string;
};
