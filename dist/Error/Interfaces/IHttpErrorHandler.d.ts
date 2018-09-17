import { ISMTPOptions } from "./ISMTPOptions";
import { IMessageOptions } from "./IMessageOptions";
import { EMethod } from "../../Rest/EMethod";
import { EErrorType } from "../Enums/EErrorType";
export interface IHttpErrorHandler {
    type: EErrorType;
    sendEmail: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISMTPOptions;
    endpoint?: string[] | string;
    method?: EMethod;
    payload?: any;
}
