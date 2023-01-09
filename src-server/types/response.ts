export interface IResponseDefault {
  success: boolean;
}
export interface IErrorResponse extends IResponseDefault {
  status: number;
  error: string;
  code?: number;
}
export interface IResponseSuccess<T> extends IResponseDefault {
  result: T;
}
