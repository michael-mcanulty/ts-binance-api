import { ICarrier } from "./ICarrier";
import { NodeMailer } from "../Error/NodeMailer";
import { IMessageOptions } from "../Error/Interfaces/IMessageOptions";
import { ISmtpOptions } from "../Error/Interfaces/ISmtpOptions";
import { TCarrier } from "./TCarrier";
import { ECarrier } from "../TextMessage/ECarrier";
export declare class TextMessage {
    static USCarriers: ICarrier[];
    carrier: TCarrier;
    domain: string;
    static mailService: NodeMailer;
    msgOptions: IMessageOptions;
    smtpOptions: ISmtpOptions;
    private _getCarrierEmailAddress;
    send(subject: string, message: string, recipientPhone: number): Promise<void>;
    sendError(error: Error, recipientPhone: number, source?: string): Promise<void>;
    constructor(carrierName: ECarrier, smtpOpts: ISmtpOptions);
}
