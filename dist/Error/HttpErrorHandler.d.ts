import { EMethod } from "../Rest/EMethod";
import { NodeMailer } from "./Email/NodeMailer";
import { IMessageOptions } from "./Email/Interfaces/IMessageOptions";
import { ServiceOptions } from "./Email/ServiceOptions";
import { HttpError } from "./HttpError";
import { IHttpErrorHandlerOptions } from "./Email/Interfaces/IHttpErrorHandlerOptions";
import { IHandleExceptionOpts } from "./Email/Interfaces/IHandleExceptionOpts";
export declare class HttpErrorHandler {
    static mailService: NodeMailer;
    static defaultErrMsgRecipient: string;
    static defaultEmailServiceOpts: ServiceOptions;
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
    handleException(code: number, message: string, opts?: IHandleExceptionOpts): Promise<any>;
    constructor(config: IHttpErrorHandlerOptions);
}
