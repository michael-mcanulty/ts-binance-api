import { IMessageOptions } from "../Interfaces/IMessageOptions";
import { ServiceOptions } from "../ServiceOptions";
export declare type Transport = (serviceOpts: ServiceOptions) => NodeMailerService;
export declare type SendMail = (msgOpts: IMessageOptions, Function) => void;
export declare type NodeMailerService = {
    createTransport: Transport;
    sendMail: SendMail;
};
