/// <reference types="node" />
import { NodeMailer } from "./NodeMailer";
import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { HttpError } from "./HttpError";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
import { URL } from "url";
import { IHttpErrorHandler } from "./Interfaces/IHttpErrorHandler";
import { ITextMsgOptions } from "../TextMessage/ITextMsgOptions";
export declare class HttpErrorHandler {
    static mailService: NodeMailer;
    static emailMsgOptions: IMessageOptions;
    static emailServiceOptions: ISmtpOptions;
    static textMsgOptions: ITextMsgOptions;
    type: string;
    sendEmail: boolean;
    sendText: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISmtpOptions;
    textMsgOpts?: ITextMsgOptions;
    endpoint?: string[] | string;
    method?: string;
    restartSingleWorker: boolean;
    payload?: any;
    static hasHandler(err: HttpError): boolean;
    execute(err: HttpError, srcUrl: URL): Promise<any>;
    constructor(config: IHttpErrorHandler);
}
