import { IMessageOptions } from "./IMessageOptions";
import { EMethod } from "../../../Rest/EMethod";
import { ISMTPOptions } from "./ISMTPOptions";
import { EErrorType } from "../../../Error/Email/Enums/EErrorType";
export interface IHttpErrorHandlerOptions {
    sendEmail: boolean;
    killAppOnError?: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISMTPOptions;
    killWorkerOnError?: boolean;
    type: EErrorType;
    endpoint?: string[] | string;
    method?: EMethod;
    payload?: any;
}
