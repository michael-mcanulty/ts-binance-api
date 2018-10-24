import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { NodeMailerService } from "./Types/Types";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
export declare class NodeMailer {
    service: NodeMailerService;
    sendEmail(msgOpts: IMessageOptions): Promise<any>;
    constructor(serviceOptions: ISmtpOptions);
}
