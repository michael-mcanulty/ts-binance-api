import { BinanceError } from "./BinanceError";
import { HttpErrorHandler } from "./HttpErrorHandler";
import { IHttpError } from "./Interfaces/IHttpError";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
export declare class HttpError extends Error {
    static fromObjLiteral(err: IHttpError): HttpError;
    static toObjLiteral(err: HttpError): IHttpError;
    static allErrors: HttpError[];
    static _objErrors: IHttpError[];
    code: number;
    handler?: HttpErrorHandler;
    isFatal?: boolean;
    message: string;
    private static _getErrorHandler;
    private static _getErrorParameters;
    private static _getErrorType;
    static fromError(err: HttpError | BinanceError): HttpError;
    static getErrorByCode(code: number): HttpError | null;
    static init(options: IBinanceOptions, _jsonErrs?: IHttpError[]): HttpError[];
    static isHttpError(err: HttpError | Error): boolean;
    constructor(code: number, message: string, handler?: HttpErrorHandler, isFatal?: boolean);
}
