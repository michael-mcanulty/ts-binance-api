import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { NodeMailerService } from "./Types/Types";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
export declare class NodeMailer {
    static Service: NodeMailerService;
    sendEmail(msgOpts: IMessageOptions, serviceOptions: ISmtpOptions): Promise<any>;
    constructor();
}
