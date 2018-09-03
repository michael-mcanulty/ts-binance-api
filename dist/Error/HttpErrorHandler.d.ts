import { EMethod } from "../Rest/EMethod";
import { NodeMailer } from "./Email/NodeMailer";
import { IMessageOptions } from "./Email/Interfaces/IMessageOptions";
import { ServiceOptions } from "./Email/ServiceOptions";
import { IServiceOptions } from "./Email/Interfaces/IServiceOptions";
import { EErrorType } from "../../dist/Error/Email/Enums/EErrorType";
export declare class HttpErrorHandler {
    static mailService: NodeMailer;
    static defaultErrMsgRecipient: string;
    static defaultEmailServiceOpts: ServiceOptions;
    endpoint?: string[];
    method?: string;
    payload?: any;
    killAppOnError?: boolean;
    emailMsgOpts?: IMessageOptions;
    emailServiceOpts?: ServiceOptions;
    killWorkerOnError: boolean;
    sendEmail: boolean;
    type: string;
    handleException(code: number, message: string, method: EMethod, endpoint: string[] | string, workerId: number): Promise<any>;
    constructor(type: EErrorType, sendEmail?: boolean, endpoint?: string[], emailServiceOpts?: IServiceOptions, emailMsgOpts?: IMessageOptions);
}
