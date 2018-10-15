import { TextMessage } from "../TextMessage/TextMessage";
import { ECarrier, ISmtpOptions } from "..";
export declare class TextMessageError extends TextMessage {
    error: Error;
    recipientPhone: number;
    private _hasHandler;
    private _isFatal;
    sendError(error: Error, source?: string): Promise<void>;
    constructor(carrierName: ECarrier, recipientPhone: number, smtpOpts: ISmtpOptions);
}
