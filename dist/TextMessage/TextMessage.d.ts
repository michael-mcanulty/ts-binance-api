import { ICarrier } from "./ICarrier";
import { NodeMailer } from "../Error/NodeMailer";
import { ITextMsgOpts } from "./ITextMsgOpts";
import { IMessageOptions } from "../Error/Interfaces/IMessageOptions";
import { HttpError } from "..";
import { ISmtpOptions } from "Error/Interfaces/ISmtpOptions";
import { TCarrier } from "./TCarrier";
export declare class TextMessage {
    static USCarriers: ICarrier[];
    carrier: TCarrier;
    domain: string;
    static mailService: NodeMailer;
    msgOptions?: IMessageOptions;
    static options: ITextMsgOpts;
    smtpOptions?: ISmtpOptions;
    getEmailAddress(phoneNumber?: number): string;
    send(error: HttpError | Error, srcUrl?: string): Promise<void>;
    constructor(carrierName?: TCarrier, msgOptions?: IMessageOptions, smtpOptions?: ISmtpOptions);
}
