import { ISmtpOptions } from "./ISmtpOptions";
import { IMessageOptions } from "./IMessageOptions";
export interface IEmailOptions {
    message: IMessageOptions;
    smtpService: ISmtpOptions;
}
