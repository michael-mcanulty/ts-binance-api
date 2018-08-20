import { EErrorType } from "./Email/Enums/EErrorType";
import { BinanceError } from "./BinanceError";
import { EMethod } from "../Rest/EMethod";
import { IEmailOptions } from "./Email/Interfaces/IServiceOprtions";
export declare class HttpErrorHandler {
    private static _emailService;
    static emailOptions?: IEmailOptions;
    endpoint?: string;
    method?: string;
    payload?: any[];
    port?: number;
    recipientEmail?: string;
    sendEmail?: boolean;
    type: string;
    private readonly _url?;
    readonly url: string;
    handleError(code: number, message: string): Promise<any>;
    constructor(type: EErrorType, method?: EMethod, port?: number, sendEmail?: boolean, endpoint?: string, recipientEmail?: string);
}
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
