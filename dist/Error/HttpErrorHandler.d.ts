import { EMethod } from "../Rest/EMethod";
import { IEmailOptions } from "./Email/Interfaces/IServiceOprtions";
import { BinanceError } from "./BinanceError";
import { HttpError } from "./HttpError";
import { EErrorType } from "./Email/Enums/EErrorType";
export declare class HttpErrorHandler {
    code: number;
    emailAddress?: string;
    emailOptions?: IEmailOptions;
    private static emailService;
    endpoint: string;
    message: string;
    method: string;
    payload?: any[];
    port: number;
    sendEmail: boolean;
    type: string;
    url: string;
    static allErrors: {
        "message": string;
        "code": number;
        handler: HttpErrorHandler;
    }[];
    handleError(error: BinanceError | HttpError): Promise<any>;
    constructor(code: number, endpoint: string, port: number, type: EErrorType, method: EMethod, sendEmail: boolean, emailAddress?: string, emailOptions?: IEmailOptions);
}
