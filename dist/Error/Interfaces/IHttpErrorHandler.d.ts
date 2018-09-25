import { ISmtpOptions } from "./ISmtpOptions";
import { IMessageOptions } from "./IMessageOptions";
import { EMethod } from "../../Rest/EMethod";
import { EErrorType } from "../Enums/EErrorType";
import { ITextMsgOptions } from "../../TextMessage/ITextMsgOptions";
export interface IHttpErrorHandler {
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISmtpOptions;
    endpoint?: string[] | string;
    method?: EMethod;
    payload?: any;
    restartSingleWorker?: boolean;
    sendEmail: boolean;
    sendText: boolean;
    textMsgOpts?: ITextMsgOptions;
    type: EErrorType;
}
