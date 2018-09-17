import {IMessageOptions} from "../Interfaces/IMessageOptions";
import {ISmtpOptions} from "../Interfaces/ISmtpOptions";

export type Transport = (serviceOpts: ISmtpOptions) => NodeMailerService;
export type SendMail = (msgOpts: IMessageOptions, Function) => void;
export type NodeMailerService = { createTransport: Transport, sendMail: SendMail };