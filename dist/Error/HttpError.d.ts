import { BinanceError } from "./BinanceError";
import { HttpErrorHandler } from "./HttpErrorHandler";
import { ISMTPOptions } from "./Interfaces/ISMTPOptions";
import { IMessageOptions } from "./Interfaces/IMessageOptions";
export declare class HttpError extends Error {
    static allErrors: HttpError[];
    private static httpErrors;
    code: number;
    handler?: HttpErrorHandler;
    message: string;
    static GetTimeoutFromIPBannedMsg(err: BinanceError): number;
    private static _getErrorHandler(error);
    private static _getErrorParameters(err);
    private static _getErrorType(err);
    static fromError(err: HttpError | BinanceError): HttpError;
    static getErrorByCode(code: number): HttpError;
    static init(msgOptions?: IMessageOptions, emailServiceOptions?: ISMTPOptions): HttpError[];
    static isHttpError(err: HttpError | Error): boolean;
    constructor(code: number, message: string, handler?: HttpErrorHandler);
}
