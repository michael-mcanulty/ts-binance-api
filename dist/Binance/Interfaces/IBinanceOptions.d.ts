import { IBinanceApiAuth } from "../../Account/Interfaces/IBinanceApiAuth";
import { IMessageOptions } from "../../Error/Email/Interfaces/IMessageOptions";
import { ISMTPOptions } from "../../Error/Email/Interfaces/ISMTPOptions";
export interface IBinanceOptions {
    _id?: string;
    auth: IBinanceApiAuth;
    emailServiceOpts: ISMTPOptions;
    emailMsgOpts: IMessageOptions;
    test: boolean;
    useServerTime: boolean;
}
