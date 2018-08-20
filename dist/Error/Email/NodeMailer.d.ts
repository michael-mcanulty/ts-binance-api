import { IEmailOptions } from "./Interfaces/IServiceOprtions";
import { ServiceOptions } from "./ServiceOptions";
import { IMessageOptions } from "./Interfaces/IMessageOptions";
import { NodeMailerService } from "./Types/Types";
export declare class NodeMailer {
    static Options: ServiceOptions;
    static Service: NodeMailerService;
    private _msgOpts;
    sendEmail(msgOpts: IMessageOptions, serviceOptions?: ServiceOptions): Promise<any>;
    constructor(serviceOptions: IEmailOptions);
}
