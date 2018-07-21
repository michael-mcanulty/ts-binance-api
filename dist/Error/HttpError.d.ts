import { EErrorType } from "./Email/Enums/EErrorType";
import { BinanceError } from "./BinanceError";
import { HttpErrorHandler } from "./HttpErrorHandler";
export declare class HttpError extends Error {
    static all: HttpError[];
    code: number;
    message: string;
    handler?: HttpErrorHandler;
    static GetErrorType(err: BinanceError | HttpError): EErrorType;
    static GetErrorByCode(code: number): HttpError;
    static GetTimeoutFromIPBannedMsg(err: BinanceError): number;
    constructor(err: BinanceError | HttpError);
}
