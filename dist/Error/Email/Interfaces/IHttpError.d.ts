import { HttpErrorHandler } from "../../../../dist/Error/HttpErrorHandler";
export declare class IHttpError {
    code: number;
    message: string;
    handler?: HttpErrorHandler;
}
