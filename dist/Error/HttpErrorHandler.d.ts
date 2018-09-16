import { EMethod } from "../Rest/EMethod";
import { NodeMailer } from "./Email/NodeMailer";
import { IMessageOptions } from "./Email/Interfaces/IMessageOptions";
import { HttpError } from "./HttpError";
import { IHttpErrorHandlerOptions } from "./Email/Interfaces/IHttpErrorHandlerOptions";
import { ISMTPOptions } from "./Email/Interfaces/ISMTPOptions";
export declare class HttpErrorHandler {
    static mailService: NodeMailer;
    static emailMsgOptions: IMessageOptions;
    static emailServiceOptions: ISMTPOptions;
    type: string;
    sendEmail: boolean;
    killAppOnError?: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISMTPOptions;
    killWorkerOnError: boolean;
    endpoint?: string[] | string;
    method?: EMethod;
    payload?: any;
    static hasHandler(err: HttpError): boolean;
    execute(err: HttpError, port: number, workerId?: number): Promise<any>;
    constructor(config: IHttpErrorHandlerOptions);
}
