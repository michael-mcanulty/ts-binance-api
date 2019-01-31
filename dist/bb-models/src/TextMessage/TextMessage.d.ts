import { ICarrier } from "./ICarrier";
import { IMessageOptions } from "../../../bb-models/src/Error/Interfaces/IMessageOptions";
import { ISmtpOptions } from "../../../bb-models/src/Error/Interfaces/ISmtpOptions";
import { TCarrier } from "./TCarrier";
export declare class TextMessage {
    static USCarriers: ICarrier[];
    carrier: TCarrier;
    domain: string;
    private _mailService;
    msgOptions: IMessageOptions;
    smtpOptions: ISmtpOptions;
    private _getCarrierEmailAddress;
    send(subject: string, message: string, recipientPhone: number): Promise<void>;
    sendError(error: Error, recipientPhone: number, source?: string): Promise<void>;
    constructor(carrierName: TCarrier, smtpOpts: ISmtpOptions);
}
