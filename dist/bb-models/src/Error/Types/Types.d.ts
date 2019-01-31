import { IMessageOptions } from "../Interfaces/IMessageOptions";
import { ISmtpOptions } from "../Interfaces/ISmtpOptions";
export declare type Transport = (serviceOpts: ISmtpOptions) => NodeMailerService;
export declare type SendMail = (msgOpts: IMessageOptions, Function: any) => void;
export declare type NodeMailerService = {
    createTransport: Transport;
    sendMail: SendMail;
};
