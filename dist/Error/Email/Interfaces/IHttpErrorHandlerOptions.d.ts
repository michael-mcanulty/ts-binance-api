import { IMessageOptions } from "./IMessageOptions";
import { ISMTPOptions } from "./ISMTPOptions";
import { EErrorType } from "../../../Error/Email/Enums/EErrorType";
import { IBaseHandleException } from "./IBaseHandleException";
export interface IHttpErrorHandlerOptions extends IBaseHandleException {
    sendEmail: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ISMTPOptions;
    type: EErrorType;
}
