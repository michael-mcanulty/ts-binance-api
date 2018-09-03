import { HttpErrorHandler } from "../../HttpErrorHandler";
export declare class IHttpError {
    code: number;
    message: string;
    handler?: HttpErrorHandler;
}
