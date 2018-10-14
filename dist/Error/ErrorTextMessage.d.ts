import { TextMessage } from "../TextMessage/TextMessage";
import { HttpError } from "./HttpError";
import { ECarrier } from "../TextMessage/ECarrier";
import { ISmtpOptions } from "./Interfaces/ISmtpOptions";
export declare class ErrorTextMessage extends TextMessage {
    error: HttpError | Error;
    recipientPhone: number;
    private _hasHandler;
    private _isFatal;
    sendError(error: HttpError | Error, source?: string): Promise<void>;
    constructor(carrierName: ECarrier, recipientPhone: number, smtpOpts: ISmtpOptions);
}
