/// <reference types="node" />
import { NodeMailer } from "./NodeMailer";
import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { HttpError } from "./HttpError";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
import { URL } from "url";
import { IHttpErrorHandler } from "./Interfaces/IHttpErrorHandler";
export declare class HttpErrorHandler {
    static mailService: NodeMailer;
    static emailMsgOptions: IMessageOptions;
    static emailServiceOptions: ISmtpOptions;
    type: string;
    sendEmail: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISmtpOptions;
    endpoint?: string[] | string;
    method?: string;
    payload?: any;
    static hasHandler(err: HttpError): boolean;
    execute(err: HttpError, srcUrl: URL): Promise<any>;
    constructor(config: IHttpErrorHandler);
}
