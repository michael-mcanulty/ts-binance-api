import { IMessageOptions } from "../Interfaces/IMessageOptions";
import { ISMTPOptions } from "../Interfaces/ISMTPOptions";
export declare type Transport = (serviceOpts: ISMTPOptions) => NodeMailerService;
export declare type SendMail = (msgOpts: IMessageOptions, Function) => void;
export declare type NodeMailerService = {
    createTransport: Transport;
    sendMail: SendMail;
};
