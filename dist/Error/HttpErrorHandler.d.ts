import { EMethod } from "../Rest/EMethod";
import { IEmailOptions } from "./Email/Interfaces/IServiceOprtions";
import { BinanceError } from "./BinanceError";
import { HttpError } from "./HttpError";
import { EErrorType } from "./Email/Enums/EErrorType";
export declare class HttpErrorHandler {
    code: number;
    emailOptions?: IEmailOptions;
    emailAddress?: string;
    message: string;
    private static emailService;
    endpoint: string;
    method: string;
    port: number;
    sendEmail: boolean;
    payload?: any[];
    type: string;
    url: string;
    handleError(error: BinanceError | HttpError): Promise<any>;
    constructor(code: number, endpoint: string, port: number, type: EErrorType, method: EMethod, sendEmail: boolean, emailAddress?: string, emailOptions?: IEmailOptions);
}
