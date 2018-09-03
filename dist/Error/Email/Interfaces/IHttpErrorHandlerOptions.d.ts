import { IServiceOptions } from "./IServiceOptions";
import { IMessageOptions } from "./IMessageOptions";
import { EErrorType } from "../../..";
import { EMethod } from "../../../Rest/EMethod";
export interface IHttpErrorHandlerOptions {
    sendEmail: boolean;
    killAppOnError?: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: IServiceOptions;
    killWorkerOnError?: boolean;
    type: EErrorType;
    endpoint?: string[] | string;
    method?: EMethod;
    payload?: any;
}
