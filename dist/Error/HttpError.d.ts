import { BinanceError } from "./BinanceError";
import { HttpErrorHandler } from "./HttpErrorHandler";
import { IHttpError } from "./Interfaces/IHttpError";
import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
export declare class HttpError extends Error {
    static fromObjLiteral(err: IHttpError): HttpError;
    static toObjLiteral(err: HttpError): IHttpError;
    static allErrors: HttpError[];
    static _objErrors: IHttpError[];
    code: number;
    handler?: HttpErrorHandler;
    isFatal?: boolean;
    message: string;
    static GetTimeoutFromIPBannedMsg(err: BinanceError): number;
    private static _getErrorHandler(error);
    private static _getErrorParameters(err);
    private static _getErrorType(err);
    static fromError(err: HttpError | BinanceError): HttpError;
    static getErrorByCode(code: number): HttpError | null;
    static init(msgOptions?: IMessageOptions, emailServiceOptions?: ISmtpOptions, _jsonErrs?: IHttpError[]): HttpError[];
    static isHttpError(err: HttpError | Error): boolean;
    constructor(code: number, message: string, handler?: HttpErrorHandler, isFatal?: boolean);
}
