import { ISmtpOptions } from "./ISmtpOptions";
import { IMessageOptions } from "./IMessageOptions";
import { TMethod } from "../../Rest/TMethod";
import { ITextMsgOptions } from "../../TextMessage/ITextMsgOptions";
import { TErrorType } from "../Enums/EErrorType";
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
