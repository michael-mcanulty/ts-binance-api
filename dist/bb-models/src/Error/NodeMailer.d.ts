import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
export declare class NodeMailer {
    private _service;
    sendEmail(msgOpts: IMessageOptions): Promise<any>;
    constructor(serviceOptions: ISmtpOptions);
}
