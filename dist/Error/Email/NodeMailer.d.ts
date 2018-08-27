import { ServiceOptions } from "./ServiceOptions";
import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { NodeMailerService } from "./Types/Types";
export declare class NodeMailer {
    static Service: NodeMailerService;
    sendEmail(msgOpts: IMessageOptions, serviceOptions: ServiceOptions): Promise<any>;
    constructor();
}
