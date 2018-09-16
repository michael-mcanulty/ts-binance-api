import { BinanceError } from "./BinanceError";
import { HttpErrorHandler } from "./HttpErrorHandler";
import { ISMTPOptions } from "./Email/Interfaces/ISMTPOptions";
import { IMessageOptions } from "../Error/Email/Interfaces/IMessageOptions";
export declare class HttpError extends Error {
    static allErrors: HttpError[];
    code: number;
    handler?: HttpErrorHandler;
    private static httpErrors;
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
