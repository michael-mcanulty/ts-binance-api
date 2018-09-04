import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { NodeMailerService } from "./Types/Types";
import { ISMTPOptions } from "./Interfaces/ISMTPOptions";
export declare class NodeMailer {
    static Service: NodeMailerService;
    sendEmail(msgOpts: IMessageOptions, serviceOptions: ISMTPOptions): Promise<any>;
    constructor();
}
