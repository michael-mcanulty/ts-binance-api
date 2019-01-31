/// <reference types="node" />
import { NodeMailer } from "./NodeMailer";
import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { HttpError } from "./HttpError";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
import { URL } from "url";
import { IHttpErrorHandler } from "./Interfaces/IHttpErrorHandler";
import { ITextMsgOptions } from "../TextMessage/ITextMsgOptions";
import { TextMessage } from "../TextMessage/TextMessage";
import { TMethod } from "@michael-mcanulty/ts-binance-api";
export declare class HttpErrorHandler {
    static emailMsgOptions: IMessageOptions;
    emailMsgOpts?: IMessageOptions;
    static emailServiceOptions: ISmtpOptions;
    emailServiceOpts?: ISmtpOptions;
    endpoint?: string[] | string;
    static mailService: NodeMailer;
    static textMsgService: TextMessage;
    method?: TMethod;
    payload?: any;
    restartSingleWorker: boolean;
    sendEmail: boolean;
    sendText: boolean;
    static textMsgOptions: ITextMsgOptions;
    textMsgOpts?: ITextMsgOptions;
    type: string;
    execute(err: HttpError, srcUrl: URL): Promise<any>;
    static hasHandler(err: HttpError): boolean;
    constructor(handler: IHttpErrorHandler);
}
