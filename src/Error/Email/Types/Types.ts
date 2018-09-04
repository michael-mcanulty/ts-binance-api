import {IMessageOptions} from "../Interfaces/IMessageOptions";
import {ISMTPOptions} from "../Interfaces/ISMTPOptions";

export type Transport = (serviceOpts: ISMTPOptions) => NodeMailerService;
export type SendMail = (msgOpts: IMessageOptions, Function) => void;
export type NodeMailerService = { createTransport: Transport, sendMail: SendMail };