import { ISmtpOptions } from "./ISmtpOptions";
import { IMessageOptions } from "./IMessageOptions";
import { TMethod } from "../../Rest/TMethod";
import { EErrorType } from "../Enums/EErrorType";
import { ITextMsgOptions } from "../../TextMessage/ITextMsgOptions";
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
    type: EErrorType;
}
