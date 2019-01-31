import { IBinanceApiAuth } from "../../Account/Interfaces/IBinanceApiAuth";
import { IMessageOptions } from "../../../../bb-models/src/Error/Interfaces/IMessageOptions";
import { ISmtpOptions } from "../../../../bb-models/src/Error/Interfaces/ISmtpOptions";
import { ITextMsgOptions } from "../../../../bb-models/src/TextMessage/ITextMsgOptions";
export interface IBinanceOptions {
    _id?: string;
    auth: IBinanceApiAuth;
    emailServiceOpts: ISmtpOptions;
    emailMsgOpts: IMessageOptions;
    test: boolean;
    useServerTime: boolean;
    textMsgOpts: ITextMsgOptions;
}
