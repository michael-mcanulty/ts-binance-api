import { IHttpErrorHandler } from "./IHttpErrorHandler";
export interface IHttpError {
    code: number;
    message: string;
    handler?: IHttpErrorHandler;
}
