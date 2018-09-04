import { EMethod } from "../Rest/EMethod";
import { NodeMailer } from "./Email/NodeMailer";
import { IMessageOptions } from "./Email/Interfaces/IMessageOptions";
import { ServiceOptions } from "./Email/ServiceOptions";
import { HttpError } from "./HttpError";
import { IHttpErrorHandlerOptions } from "./Email/Interfaces/IHttpErrorHandlerOptions";
import { IHandleExceptionOptions } from "./Email/Interfaces/IHandleExceptionOptions";
import { IServiceOptions } from "../Error/Email/Interfaces/IServiceOptions";
export declare class HttpErrorHandler {
    static mailService: NodeMailer;
    static emailMsgOptions: IMessageOptions;
    static emailServiceOptions: IServiceOptions;
    type: string;
    sendEmail: boolean;
    killAppOnError?: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ServiceOptions;
    killWorkerOnError: boolean;
    endpoint?: string[] | string;
    method?: EMethod;
    payload?: any;
    static hasHandler(err: HttpError): boolean;
    execute(options: IHandleExceptionOptions): Promise<any>;
    constructor(config: IHttpErrorHandlerOptions);
}
