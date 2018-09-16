import { EErrorType } from "./Email/Enums/EErrorType";
import { BinanceError } from "./BinanceError";
import { HttpErrorHandler } from "./HttpErrorHandler";
import { EMethod } from "../Rest/EMethod";
export declare class HttpError extends Error {
    test: ({
        httpError: {
            code: number;
            message: string;
        };
        httpErrorHandler: {
            type: EErrorType;
            sendEmail: boolean;
            endpoint: string[];
        };
    } | {
        httpError: {
            code: number;
            message: string;
        };
        httpErrorHandler: {
            type: EErrorType;
            sendEmail: boolean;
            endpoint: string[];
            method: EMethod;
        };
    } | {
        httpError: {
            code: number;
            message: string;
        };
        httpErrorHandler: {
            type: EErrorType;
            sendEmail: boolean;
        };
    })[];
    static allErrors: HttpError[];
    code: number;
    handler?: HttpErrorHandler;
    message: string;
    static getErrorByCode(code: number): HttpError;
    private static _getErrorHandler(error);
    private static _getErrorParameters(err);
    private static _getErrorType(err);
    static GetTimeoutFromIPBannedMsg(err: BinanceError): number;
    static fromError(err: HttpError | BinanceError): HttpError;
    static isHttpError(err: HttpError | Error): boolean;
    constructor(code: number, message: string, handler?: HttpErrorHandler);
}
