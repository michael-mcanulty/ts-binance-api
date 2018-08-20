import { EMethod } from "../Rest/EMethod";
import { IEmailOptions } from "./Email/Interfaces/IServiceOprtions";
import { EErrorType } from "./Email/Enums/EErrorType";
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
