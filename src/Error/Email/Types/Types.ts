import {IMessageOptions} from "../Interfaces/IMessageOptions";
import {ServiceOptions} from "../ServiceOptions";

export type Transport = (serviceOpts: ServiceOptions) => NodeMailerService;
export type SendMail = (msgOpts: IMessageOptions, Function) => void;
export type NodeMailerService = { createTransport: Transport, sendMail: SendMail };