import { BinanceError } from "./BinanceError";
import { HttpErrorHandler } from "./HttpErrorHandler";
export declare class HttpError extends Error {
    static allErrors: HttpError[];
    code: number;
    handler?: HttpErrorHandler;
    message: string;
    private static _getErrorByCode(code);
    private static _getErrorHandler(error);
    private static _getErrorParameters(err);
    private static _getErrorType(err);
    static GetTimeoutFromIPBannedMsg(err: BinanceError): number;
    static fromError(err: HttpError | BinanceError): HttpError;
    constructor(code: number, message: string, handler?: HttpErrorHandler);
}
