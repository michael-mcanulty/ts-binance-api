import { ISmtpOptions } from "./ISmtpOptions";
import { IMessageOptions } from "./IMessageOptions";
import { ITextMsgOptions } from "../../TextMessage/ITextMsgOptions";
import { TErrorType } from "../Enums/EErrorType";
import { TMethod } from "@michael-mcanulty/ts-binance-api/dist";
export interface IHttpErrorHandler {
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISmtpOptions;
    endpoint?: string[] | string;
    method?: TMethod;
    payload?: any;
    restartSingleWorker?: boolean;
    sendEmail: boolean;
    sendText: boolean;
    textMsgOpts?: ITextMsgOptions;
    type: TErrorType;
}
