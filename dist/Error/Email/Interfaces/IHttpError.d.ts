import { HttpErrorHandler } from "../../../../src/Error/HttpError";
export declare class IHttpError {
    code: number;
    message: string;
    handler?: HttpErrorHandler;
}
