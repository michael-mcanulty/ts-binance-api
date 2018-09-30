import { IBinanceApiAuth } from "../../Account/Interfaces/IBinanceApiAuth";
import { IMessageOptions } from "../../Error/Interfaces/IMessageOptions";
import { ISmtpOptions } from "../../Error/Interfaces/ISmtpOptions";
import { ITextMsgOptions } from "../../TextMessage/ITextMsgOptions";
export interface IBinanceOptions {
    _id?: string;
    auth: IBinanceApiAuth;
    emailServiceOpts: ISmtpOptions;
    emailMsgOpts: IMessageOptions;
    test: boolean;
    useServerTime: boolean;
    textMsgOpts: ITextMsgOptions;
}
