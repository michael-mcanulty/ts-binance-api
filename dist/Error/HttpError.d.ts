import { EErrorType } from "./Email/Enums/EErrorType";
import { BinanceError } from "./BinanceError";
import { EMethod } from "../Rest/EMethod";
import { IMessageOptions } from "./Email/Interfaces/IMessageOptions";
import { ServiceOptions } from "./Email/ServiceOptions";
export declare class HttpErrorHandler {
    private static _nodeMailerService;
    static defaultErrMsgRecipient: string;
    static defaultEmailServiceOpts: ServiceOptions;
    endpoint?: string;
    method?: string;
    payload?: any[];
    port?: number;
    sendEmail?: boolean;
    emailMsgOpts?: IMessageOptions;
    type: string;
    emailServiceOpts?: ServiceOptions;
    private readonly _url?;
    readonly url: string;
    handleError(code: number, message: string): Promise<any>;
    constructor(type: EErrorType, method?: EMethod, port?: number, sendEmail?: boolean, endpoint?: string, emailMsgOpts?: IMessageOptions, emailServiceOpts?: ServiceOptions);
}
export declare class HttpError extends Error {
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
    constructor(code: number, message: string, handler?: HttpErrorHandler);
}
